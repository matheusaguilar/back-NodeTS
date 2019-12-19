export class DateUtil {

  /**
   * convert a date object to string.
   * @param dateObj the date to be converted.
   */
  static dateToString(dateObj: Date): string | null {
    try {
      return dateObj.toISOString().slice(0, 19).replace('T', ' ');
    } catch (e) {
      return null;
    }
  }

}
