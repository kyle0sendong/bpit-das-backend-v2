// since env should be copied when running the pkg's exe file. this will serve as alternative

module.exports = {
  PORT:50001,
  JWT_SECRET: 'secreeethehe',
  JWT_EXPIRES_IN: '365d',
  
  LOCAL_DB_HOST: 'localhost',
  LOCAL_DB_USER: 'root',
  LOCAL_DB_PASSWORD: 'testing123',
  LOCAL_DB_PORT: 54545,
  LOCAL_DB_NAME: 'bpitdas'
}
