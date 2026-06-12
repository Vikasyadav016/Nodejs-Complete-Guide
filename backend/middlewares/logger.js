const requestLogger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);

  next();
};

const errorLogger = (err, req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  console.error(`[${timestamp}] ERROR ${method} ${url} ${status} - ${message}`);
  console.error(err.stack || err);

  res.status(status).json({
    message,
    status,
    error: true,
  });
};

module.exports = { requestLogger, errorLogger };
