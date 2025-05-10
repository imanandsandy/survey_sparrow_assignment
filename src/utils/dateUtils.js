import dayjs from "dayjs";

export const getDaysInMonthGrid = (year, month) => {
  const startOfMonth = dayjs().year(year).month(month).startOf("month");
  const endOfMonth = dayjs().year(year).month(month).endOf("month");

  const startDay = startOfMonth.day(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = endOfMonth.date();

  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const dates = [];

  for (let i = 0; i < totalCells; i++) {
    const date = startOfMonth.subtract(startDay, 'day').add(i, 'day');
    dates.push(date);
  }

  return dates;
};
