export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large (max 5MB)' });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    console.error('[API Error]', status, err.message);
    if (err.stack) console.error(err.stack);
  }
  const safeClientMessage =
    status >= 500
      ? process.env.NODE_ENV !== 'production'
        ? message
        : 'Internal Server Error'
      : message;
  res.status(status).json({
    error: safeClientMessage,
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {}),
  });
}
