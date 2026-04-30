export const generateTimeSlots = (
  start: string,
  end: string,
  duration: number,
  date: Date
) => {
  const slots: { start: Date; end: Date }[] = [];

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  // Use UTC methods to ensure the numbers you provide 
  // are the exact numbers stored in the Date object.
  let current = new Date(date);
  current.setUTCHours(startH!, startM!, 0, 0);

  const endTime = new Date(date);
  endTime.setUTCHours(endH!, endM!, 0, 0);

  while (current < endTime) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current);

    // Use getUTCMinutes/setUTCMinutes to avoid local offset shifts
    slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + duration);

    if (slotEnd <= endTime) {
      slots.push({
        start: new Date(slotStart),
        end: new Date(slotEnd),
      });
    }

    current.setUTCMinutes(current.getUTCMinutes() + duration);
  }

  return slots;
};
