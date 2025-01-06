const errorHandler = (error, req, res, next) => {
  
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  res.status(parseInt(error.statusCode)).json({
    statusCode: error.statusCode,
    message: error.message
  })

}

module.exports = errorHandler;