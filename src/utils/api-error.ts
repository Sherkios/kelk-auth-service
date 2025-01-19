export default class ApiError extends Error {
  public statusCode: number;
  public errors: { [key: string]: string };

  constructor(statusCode: number = 500, message: string, errors?: { [key: string]: string }) {
    super(message);

    this.statusCode = statusCode;

    this.errors = errors ?? {};
  }

  public static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  public static BadRequest(message: string, errors?: { [key: string]: string }) {
    return new ApiError(400, message, errors);
  }

  public static ValidateError(errors: { [key: string]: string }) {
    return new ApiError(400, "Ошибка валидации", errors);
  }
}
