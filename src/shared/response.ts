export class Response {
  success: boolean;

  message: string;

  data: any;

  constructor(partial: Partial<Response>) {
    Object.assign(this, partial);
  }
}
