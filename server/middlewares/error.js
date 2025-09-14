const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ success: false, message: err.message });
  } else {
    res.status(500).json({ success: false,  message: err.message });
  }
};

export default errorHandler;
