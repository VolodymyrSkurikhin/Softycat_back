class CustomError extends Error {
  status: number;

  constructor(message: string, { status }: { status: number }) {
    super(message);
    this.status = status;
  }
}

export const HttpError = (status: number, message: string) => {
  const error = new CustomError(message, { status });
  // error.status = status;
  return error;
};
