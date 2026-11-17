// An error whose message is safe and helpful to show to the person using the site.
export class AppError extends Error {
  constructor(message, status = 422) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}
