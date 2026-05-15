import { useMemo, useState } from 'react';
import { calculatePrice } from '../utils/calculatePrice';

export function useBooking(pricePerHour: number, initialDurationHours = 1) {
  const [durationHours, setDurationHours] = useState(initialDurationHours);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  const total = useMemo(
    () => calculatePrice(pricePerHour, durationHours, discount),
    [pricePerHour, durationHours, discount],
  );

  return {
    durationHours,
    setDurationHours,
    discount,
    setDiscount,
    notes,
    setNotes,
    total,
  };
}
