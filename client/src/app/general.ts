export enum Status {
  Refesh,
  Add,
  LoadOrder,
  isDonhang,
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
