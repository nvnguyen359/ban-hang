interface String {
  add(...strings: string[]): string;
  removeAccents(): string;
  convertDateVNToISO(): Date;
  isValidDate(): boolean;
  DateFormatDDMMYYY(): string;
}
interface Date {}

String.prototype.DateFormatDDMMYYY = function () {
  if (new Date(this.toString()).toString() !== "Invalid Date") {
    var timestamp = new Date(this.toString());
    const day =
      timestamp.getDate() < 10
        ? `0${timestamp.getDate()}`
        : timestamp.getDate();
    const m =
      timestamp.getMonth() + 1 < 10
        ? `0${timestamp.getMonth() + 1}`
        : timestamp.getMonth() + 1;
    return day + "/" + m + "/" + timestamp.getFullYear();
  } else {
    return this.toString();
  }
};
String.prototype.add = function (...strings) {
  return this + strings.join("");
};

String.prototype.removeAccents = function () {
  const result: string = this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  return result.toString();
};
String.prototype.isValidDate = function () {
  return new Date(this.toString()).toString() !== "Invalid Date";
};
String.prototype.convertDateVNToISO = function () {
  var timestamp = Date.parse(this.toString());
  if (isNaN(timestamp) == false) {
    return new Date(timestamp);
  } else {
    const t = this.split("/");
    const date = new Date(parseInt(t[2]), parseInt(t[1]), parseInt(t[0]));
    return t.length == 3 ? date : new Date(this.toString());
  }
};

