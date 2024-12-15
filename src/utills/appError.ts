// Purpose: Custom Error class to handle API errors.
import { HttpStatusCode } from '../constants/httpStatusCode';


class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string
  ) {
    super(message);

    // Capture the stack trace
    Error.captureStackTrace(this, this instanceof AppError ? this.constructor : this);
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.stack);
    }

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
