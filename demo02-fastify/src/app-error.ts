// 带状态码的错误：在路由里 throw 出来，统一错误处理会读取 statusCode
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
