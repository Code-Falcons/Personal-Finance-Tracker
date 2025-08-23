const notFound = (req, res, next) => {
  const error = new Error("Not Found - 404");
  error.status = 404;
  next(error);
};

export default notFound;
