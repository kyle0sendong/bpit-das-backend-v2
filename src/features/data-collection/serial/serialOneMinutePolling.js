const { readRegister } = require("./utils");
const {toSnakeCase} = require("@utils/strings");

const ModbusRTU = require("modbus-serial");


const serialOneMinutePolling = async (timebaseId, tcpAnalyzers, modbusTcpParameters, accumulator) => {


    // Function to initialize the connection
    const initializeConnection = async () => {
      try {
        await client.connectRTU("COM1", { baudRate: 9600 });
        console.log("Connected to Modbus RTU server");
        client.setID(1); // Set the Modbus device ID
      } catch (err) {
        console.error("Failed to initialize connection:", err);
      }
    };
  
    // Function to read registers
    const testReadRegister = async () => {
      try {
        if (!client.isOpen) {
          console.log("Connection not open. Reconnecting...");
          await initializeConnection();
        }
  
        // Read holding registers (address 0, length 1)
        const data = await client.readHoldingRegisters(0, 1);
        console.log("Received registers:", data.data);
      } catch (err) {
        console.error("Modbus RTU Error:", err);
  
        // If there's an error, close the connection and attempt to reconnect
        if (client.isOpen) {
          client.close();
          console.log("Connection closed due to error");
        }
      }
    };
  
    
  try {
    const seconds = new Date().getSeconds();

    for(let analyzer of tcpAnalyzers) {
      
      // connect to modbus client

      for (let parameter of modbusTcpParameters) {
        const accumulatorIndex = accumulator.findIndex( (item) => item.name == `${toSnakeCase(parameter.name)}_tcp${analyzer.id}`);
        const parameterAccumulator = accumulator[accumulatorIndex];
  
        if(seconds % parameter.request_interval == 0) {
          parameterAccumulator.count += 1;
          // read register
  
          // update current value
          // const currentValue = await CurrentValueModel.getCurrentValueByParameterAndAnalyzer(parameter.id, analyzer.id)
          // await CurrentValueModel.update({
          //   id: currentValue.id,
          //   current_value: parameterAccumulator.count
          // })

          // add value to current value
          console.log(seconds, parameterAccumulator.count, currentValue);
        }
  
        if(seconds == 0) {
          // insert to data_t1
          console.log(parameter.name, parameterAccumulator.value, "insert to 1 minute")
          parameterAccumulator.count = 0;
          parameterAccumulator.value = 0;
        }
      }
    }

  } catch (error) {
    console.log(error);
  }
}


module.exports = serialOneMinutePolling;