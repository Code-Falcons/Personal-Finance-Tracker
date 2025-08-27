import jwt from "jsonwebtoken";

const protectedRoutes = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decoded);
      req.user = decoded;
      return next();
    } catch (error) {
      const err = new Error("Not authorized, token failed or expired");
      err.status = 401;
      return next(err);
    }
  }

  if (!token) {
    const error = new Error("Not authorized, no token");
    error.status = 401;
    return next(error);
  }
};

export default protectedRoutes;
