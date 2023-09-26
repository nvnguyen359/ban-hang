

interface String {
  add(...strings: string[]): string;
  removeAccents(): string;
  convertDateVNToISO(isVn?: boolean): Date;
  isValidDate(): boolean;
  DateFormatDDMMYYY(): string;
  convertDatefromVN(): Date;
  capitalizeFirstLetter(): string;
}
interface Array<T> {
  convertDateVNView(): any[];
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
String.prototype.convertDateVNToISO = function (isVn) {
  var timestamp = Date.parse(this.toString());
  // console.log(this,isNaN(timestamp) == false)
  if (isNaN(timestamp) == false) {
    const t = this.split("/");
    const date = new Date(parseInt(t[2]), parseInt(t[1]) - 1, parseInt(t[0]));
    return !isVn ? new Date(timestamp) : date;
  } else {
    const t = this.split("/");
    const date = new Date(parseInt(t[2]), parseInt(t[1]) - 1, parseInt(t[0]));
    return t.length == 3 ? date : new Date(this.toString());
  }
};
String.prototype.convertDatefromVN = function () {
  var timestamp = Date.parse(this.toString());
  if (isNaN(timestamp) == false) {
    return new Date(timestamp);
  } else {
    const t = this.split("/");
    const date = new Date(parseInt(t[2]), parseInt(t[1]), parseInt(t[0]));
    return t.length == 3 ? date : new Date(this.toString());
  }
};
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.convertDateVNView = function () {
  let array = this as any[];
  array = array.map((x: any) => {
    let ngays = ["Ngày Nhập", "Ngày", "Ngày Bán"];
    ngays.forEach((ngay: any) => {
      if (x[ngay]) x[ngay] = `${x[ngay]}`.DateFormatDDMMYYY();
    });
    return x;
  });
  return array;
};
