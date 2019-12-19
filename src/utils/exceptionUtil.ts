export class ExceptionUtil {

  static handle(exception, message) {
    const error = new Error(exception);
    (<any>error).original = message;
    // console.error(error);
  }

}
