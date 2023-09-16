export enum Status {
  Refesh,
  Add,
  LoadOrder,
  isDonhang
}
/**default @param [ms=1000]  */
export function delay(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function trackByFn(index:number) {
  return index;
}
