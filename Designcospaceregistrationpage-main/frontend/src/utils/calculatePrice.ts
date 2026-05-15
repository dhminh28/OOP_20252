export function calculatePrice(pricePerHour: number, durationHours: number, discount = 0) {
  return Math.max(pricePerHour * durationHours - discount, 0);
}
