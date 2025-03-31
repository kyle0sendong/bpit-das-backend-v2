const cron = require('node-cron');
const TimebaseModel = require("@apiV1/timebases/TimebaseModel.js");

const TcpAnalyzerModel = require("@apiV1/analyzers/tcp/TcpAnalyzerModel.js");
const TcpParameterModel = require("@apiV1/parameters/tcp/TcpParameterModel.js");
const SerialAnalyzerModel = require("@apiV1/analyzers/serial/SerialAnalyzerModel.js");
const SerialParameterModel = require("@apiV1/parameters/serial/SerialParameterModel.js");

const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel.js");
const VirtualChannelModel = require("@apiV1/parameters/virtual-channels/VirtualChannelModel.js");

const tcpOneMinutePolling = require("./modbus-tcp/tcpOneMinutePolling.js");
const tcpAboveOneMinutePolling = require("./modbus-tcp/tcpAboveOneMinutePolling.js");

const serialOneMinutePolling = require("./serial/serialOneMinutePolling.js");
const serialAboveOneMinutePolling = require("./serial/serialAboveOneMinutePolling.js");

const vcOneMinutePolling = require("./virtual-channels/vcOneMinutePolling.js");
const vcAboveOneMinutePolling = require("./virtual-channels/vcAboveOneMinutePolling.js");
const { getDateTimeNow, getDateRange } = require("@utils/date.js");

const {
  setupCurrentValues, 
  setupVirtualChannelCurrentValues, 
  createAccumulator, 
  createTcpConnections, 
  createSerialConnections } = require("./setups.js");


class PollingScheduler {
  constructor() {
    this.runningCronJobs = [];
    this.tcpConnections = null;
    this.serialConnections = null;
    // Add other state variables as needed
  }

  async start() {
    await this.stop(); // Clean up any existing jobs first

    const timebases = await TimebaseModel.getEnabledTimebase();
    const tcpAnalyzers = await TcpAnalyzerModel.getAll();
    const tcpParameters = await TcpParameterModel.getAll();
    const serialAnalyzers = await SerialAnalyzerModel.getAll();
    const serialParameters = await SerialParameterModel.getAll();
    const virtualChannels = await VirtualChannelModel.getAll();

    await setupCurrentValues(tcpAnalyzers, tcpParameters, timebases, 'tcp');
    await setupCurrentValues(serialAnalyzers, serialParameters, timebases, 'serial');
    await setupVirtualChannelCurrentValues(virtualChannels, timebases);

    this.tcpConnections = await createTcpConnections(tcpAnalyzers);
    this.serialConnections = await createSerialConnections(serialAnalyzers);
    
    this.createCronJobs(timebases, tcpAnalyzers, tcpParameters, serialAnalyzers, serialParameters, virtualChannels);
  }

  async stop() {
    // Stop all cron jobs
    this.runningCronJobs.forEach(job => job.stop());
    this.runningCronJobs = [];
    
    // Clean up TCP connections
    if (this.tcpConnections && Array.isArray(this.tcpConnections)) {
      await Promise.all(this.tcpConnections.map(async (connection) => {
        if (connection.client && typeof connection.client.close === 'function') {
          try {
            await connection.client.close();
            console.log(`Closed TCP connection: ${connection.name}`);
          } catch (error) {
            console.error(`Error closing TCP connection ${connection.name}:`, error);
          }
        }
      }));
      this.tcpConnections = null;
    }

    // Clean up serial connections
    if (this.serialConnections && Array.isArray(this.serialConnections)) {
      await Promise.all(this.serialConnections.map(async (connection) => {
        if (connection.client && typeof connection.client.close === 'function') {
          try {
            await connection.client.close();
            console.log(`Closed serial connection: ${connection.name}`);
          } catch (error) {
            console.error(`Error closing serial connection ${connection.name}:`, error);
          }
        }
      }));
      this.serialConnections = null;
    }
  }

  async createCronJobs(timebases, tcpAnalyzers, tcpParameters, serialAnalyzers, serialParameters, virtualChannels) {
    const oneMinuteTimebase = timebases.find(item => item.timebase === 1);
    const currentDataTimebase = timebases.find(item => item.timebase === 0);

    const tcpAccumulator = createAccumulator(tcpAnalyzers, tcpParameters, 'tcp');
    const serialAccumulator = createAccumulator(serialAnalyzers, serialParameters, 'serial');

    timebases.forEach((timebase) => {
      if (timebase.timebase == 1) {
        this.addJob('*/5 * * * * *', async () => {
          await Promise.all([
            serialOneMinutePolling(this.serialConnections, [currentDataTimebase.id, oneMinuteTimebase.id], serialAnalyzers, serialParameters, serialAccumulator),
            tcpOneMinutePolling(this.tcpConnections, [currentDataTimebase.id, oneMinuteTimebase.id], tcpAnalyzers, tcpParameters, tcpAccumulator)
          ]);
        });

        this.addJob('* * * * *', async () => {
          await Promise.all([
            AnalyzerDataModel.insertData({datetime: getDateTimeNow()}, 1),
            vcOneMinutePolling(oneMinuteTimebase.id, virtualChannels, tcpParameters, serialParameters)
          ]);
        });
      }

      if (timebase.timebase > 1) {
        this.addJob(this.getCronExpression(timebase.timebase), async () => {
          const dateRange = getDateRange(timebase.timebase);
          await Promise.all([
            AnalyzerDataModel.insertData({datetime: getDateTimeNow()}, timebase.timebase),
            tcpAboveOneMinutePolling(dateRange, timebase, tcpAnalyzers, tcpParameters),
            serialAboveOneMinutePolling(dateRange, timebase, serialAnalyzers, serialParameters),
            vcAboveOneMinutePolling(dateRange, virtualChannels, timebase)
          ]);
        });
      }
    });
  }

  addJob(cronExpression, task) {
    const job = cron.schedule(cronExpression, task);
    this.runningCronJobs.push(job);
    return job;
  }

  // Function to convert minutes to cron expressions
  getCronExpression = (timebase) => {
    if (timebase === 60) {
      return `0 * * * *`;
    }  else if (timebase === 1440) {
      return `0 0 * * *`;
    } else if(timebase > 1 && timebase < 60) {
      return `*/${timebase} * * * *`; 
    } else if (timebase > 60 && timebase < 1440) {
      const hour = Math.floor(timebase/60);
      const minute = timebase % 60;
      return `${minute} */${hour} * * *`
    }
  };
}

// Singleton instance
module.exports = new PollingScheduler();