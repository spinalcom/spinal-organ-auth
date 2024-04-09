
export class AuthError extends Error {
  code: number;
  
  constructor(code: number | string ,message: string) {
    super(message);
    this.code = code as number;
  }
}