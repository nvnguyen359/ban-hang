interface String {
  add(...strings: string[]): string;
  removeAccents(): string;
}

String.prototype.add = function (...strings) {
  return this + strings.join('');
};


String.prototype.removeAccents = function () {
    const result:string = this.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
      return result.toString();
  };