export enum Status {
  Refesh,
  Add,
  LoadOrder,
  isDonhang,
}
export enum BaseApiUrl {
  NhapHangs = "nhaphang",
  ChiTietDonHangs = "chitietdonhang",
  SanpPhams = "sanpham",
  DonHangs = "donhang",
  ChiPhis = "chiphi",
  KhachHangs = "khachhang",
  All = "all",
  CongNos = "congnos",
  BaoCaos = "baocao",
}
/**default @param [ms=1000]  */
export function delay(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function trackByFn(index: number) {
  return index;
}
export function scrollTop(el?: any) {
  setTimeout(() => {
    if (!el) el = ".scroll";
    var element = document.querySelector(el);
    if (element) {
      // window.scrollTo(0, 0);
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
    }
  }, 200);
}
export function firstLastDate(date: any) {
  if (!date) date = new Date();
  const d = new Date(date);
  return {
    firstDate: new Date(d.setHours(0, 0, 0, 0)),
    lastDate: new Date(d.setHours(23, 59, 59, 999)),
    now: new Date(),
  };
}
export function lessthanDate(date: any, equa = false, today = new Date()) {
  if (equa) {
    return (
      new Date(date).setHours(0, 0, 0, 0) <=
      new Date(today).setHours(0, 0, 0, 0)
    );
  } else {
    return (
      new Date(date).setHours(0, 0, 0, 0) < new Date(today).setHours(0, 0, 0, 0)
    );
  }
}
export function firstlastMonth(y: number, m: number) {
  //var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var firstDay = new Date(y, m, 1, 0, 0, 0, 0);
  var lastDay = new Date(y, m + 1, 0, 23, 59, 59, 999);
  return { firstDay, lastDay };
}

export function getQuarter(date = new Date()) {
  return Math.floor(date.getMonth() / 3 + 1);
}
export function getStartEndMonthInQuarter(date = new Date()) {
  const getQuarter = Math.floor(date.getMonth() / 3 + 1);
  const endMonth = getQuarter * 3;
  const startMonth = endMonth - 2;
  const y = date.getFullYear();
  const fl = firstlastMonth(y, startMonth - 1);
  const fl1 = firstlastMonth(y, endMonth - 1);
  return { startMonth, endMonth,firsDate: fl.firstDay, lastDate: fl1.lastDay };
}
export function getStarEndDateInQuarter(quarter = 1, y: number) {
  const endMonth = quarter * 3;
  const startMonth = endMonth - 2;
  const fl = firstlastMonth(y, startMonth - 1);
  const fl1 = firstlastMonth(y, endMonth - 1);
  return { firstDate: fl.firstDay, lastDate: fl1.lastDay };
}
