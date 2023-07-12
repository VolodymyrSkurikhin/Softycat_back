class CustomError extends Error {
  status: number;

  constructor(message: string, { status }: { status: number }) {
    super(message);
    this.status = status;
  }
}

const errorMessageList = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};
export const HttpError = (
  status: number,
  message: string = errorMessageList[status]
) => {
  const error = new CustomError(message, { status });
  // error.status = status;
  return error;
};
