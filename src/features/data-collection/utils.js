
// Function to clean up the formula
function cleanFormula(formula) {
  const allowedPattern = /[x0-9+\-*/^().\s]/g;
  const cleanedFormula = formula.match(allowedPattern)?.join('') || '';
  return cleanedFormula.replace(/\s+/g, ' ').trim();
}

function swapBytes(value) {
  return ((value & 0xFF) << 8) | (value >>> 8);
}

const decodeData = async(rawData, dataFormat) => {
  try {
    switch (dataFormat) {
      case "16-bit":
        return rawData[0];
        
      case "32-bit Signed Big-Endian":
        return (rawData[0] << 16) | rawData[1];
        
      case "32-bit Float Big-Endian":
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(rawData[0], 0);
        buffer.writeUInt16BE(rawData[1], 2);
        return buffer.readFloatBE(0);

      case "64-bit Signed Big-Endian":
        return (
          (BigInt(rawData[0]) << 48n) |
          (BigInt(rawData[1]) << 32n) |
          (BigInt(rawData[2]) << 16n) |
          BigInt(rawData[3])
        );

      case "64-bit Double Big-Endian":
        const doubleBuffer = Buffer.alloc(8);
        doubleBuffer.writeUInt16BE(rawData[0], 0);
        doubleBuffer.writeUInt16BE(rawData[1], 2);
        doubleBuffer.writeUInt16BE(rawData[2], 4);
        doubleBuffer.writeUInt16BE(rawData[3], 6);
        return doubleBuffer.readDoubleBE(0);

      // inverse 
      case "32-bit Signed Big-Endian byte swap":
        const buffer32 = Buffer.alloc(4);
        buffer32.writeUInt16BE(swapBytes(rawData[0]), 0);
        buffer32.writeUInt16BE(swapBytes(rawData[1]), 2);
        return buffer32.readInt32BE(0);

      case "32-bit Float Big-Endian byte swap":
        const floatBuffer = Buffer.alloc(4);
        floatBuffer.writeUInt16BE(swapBytes(rawData[0]), 0);
        floatBuffer.writeUInt16BE(swapBytes(rawData[1]), 2);
        return floatBuffer.readFloatBE(0);

      case "64-bit Signed Big-Endian byte swap":
        const buffer64 = Buffer.alloc(8);
        buffer64.writeUInt16BE(swapBytes(rawData[0]), 6);
        buffer64.writeUInt16BE(swapBytes(rawData[1]), 4);
        buffer64.writeUInt16BE(swapBytes(rawData[2]), 2);
        buffer64.writeUInt16BE(swapBytes(rawData[3]), 0);
        return buffer64.readBigInt64BE(0); // Decode as 64-bit signed integer
        
      case "64-bit Double Big-Endian byte swap":
        const doubleBufferi = Buffer.alloc(8);
        doubleBufferi.writeUInt16BE(swapBytes(rawData[0]), 6);
        doubleBufferi.writeUInt16BE(swapBytes(rawData[1]), 4);
        doubleBufferi.writeUInt16BE(swapBytes(rawData[2]), 2);
        doubleBufferi.writeUInt16BE(swapBytes(rawData[3]), 0);
        return doubleBufferi.readDoubleBE(0);
    }
  } catch(error) {
    console.log("Error: ", error);
  }
}

const readModbusData = async (client, parameter) => {
  try {
    let data;
    
    switch (parameter.function_code) {

      case "0x01 Read Coil":
        const coils = await client.readCoils(parameter.start_register_address, parameter.register_count);
        data = coils.data;
        break;

      case "0x02 Read Discrete Input":
        const discreteInputs = await client.readDiscreteInputs(parameter.start_register_address, parameter.register_count);
        data = discreteInputs.data;
        break;

      case "0x03 Read Holding Register":
        const holdingRegisters = await client.readHoldingRegisters(parameter.start_register_address, parameter.register_count);
        data = holdingRegisters.data;
        break;

      case "0x04 Read Input Register":
        const inputRegisters = await client.readInputRegisters(parameter.start_register_address, parameter.register_count);
        data = inputRegisters.data;
        break;

      default:
        throw new Error(`Unsupported function code: ${parameter.function_code}`);
    }

    // Decode the data based on the specified format
    const decodedData = await decodeData(data, parameter.format);
    return decodedData;
  } catch (error) {
    console.error("Error reading Modbus data:", error);
    return null;
  }
};

const getDateRange = (timebase) => {
  const now = Date.now(); // Current timestamp in milliseconds
  const pastTime = now - (timebase * 60 * 1000); // Subtract timebase in minutes

  // Function to format timestamp to local date-time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
  };

  // Return the date range using timestamps
  return [
    formatDateTime(pastTime),
    formatDateTime(now)
  ];
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { readModbusData, decodeData, cleanFormula, getDateRange, delay };