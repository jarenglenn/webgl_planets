export function repeatArray(array: any[], count: number) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(...array);
  }
  return result;
}

export function hexToRGB(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function hexToRGBFloatArray(hex: string) {
  const rgb = hexToRGB(hex);
  return [rgb.r / 255, rgb.g / 255, rgb.b / 255];
}
