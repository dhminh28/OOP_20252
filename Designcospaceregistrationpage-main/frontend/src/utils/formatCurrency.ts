export function vnd(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatVnd(value: number) {
  return `₫ ${vnd(value)}`;
}
