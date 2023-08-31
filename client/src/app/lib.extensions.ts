interface String {
  add(...strings: string[]): string;
  removeAccents(): string;
  convertDateVNToISO():Date
}
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
interface Date{
  
}
String.prototype.convertDateVNToISO = function(){
  const t = this.split('/');
  return new Date(parseInt(t[2]),parseInt(t[1]),parseInt(t[0]))
}
