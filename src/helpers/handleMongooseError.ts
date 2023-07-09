export const handleMongooseError = (err, _data, next) => {
  err.status = 400;
  next();
};
