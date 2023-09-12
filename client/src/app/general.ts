export enum Status {
  Refesh,
  Add,
  LoadOrder
}
/**default @param [ms=1000]  */
export function delay(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
