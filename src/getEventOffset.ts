// @flow

export default function getEventOffset(event: any): [number, number] {
  const { target, clientX, clientY } = event;
  if (
    target instanceof HTMLElement &&
    typeof clientX === "number" &&
    typeof clientY === "number"
  ) {
    const { left, top } = target.getBoundingClientRect();
    return [clientX - left, clientY - top];
  }
  return [NaN, NaN];
}
