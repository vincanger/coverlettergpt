export function convertToSliderValue(value: number): number {
  const newValue = value / 50;
  return Number(newValue.toFixed(1));
}

export function convertToSliderLabel(value: number): string {
  if (value < 15) {
    return "least creative";
  } else if (value < 35) {
    return "a bit creative"
  } else if (value < 55) {
    return "more creative";
  } else if (value < 70) {
    return "very creative";
  } else {
    return "dangerously creative";
  }
}
