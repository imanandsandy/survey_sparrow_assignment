import React from "react";
import dayjs from "dayjs";
import EventCard from "./EventCard";
import { getDaysInMonthGrid } from "../utils/dateUtils";

const Calendar = ({ year, month, events }) => {
  const days = getDaysInMonthGrid(year, month);
  const today = dayjs();

  const getEventsForDate = (dateStr) => events.filter(e => e.date === dateStr);

  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} className="font-semibold">{day}</div>
      ))}
      {days.map(date => {
        const dateStr = date.format("YYYY-MM-DD");
        const isToday = date.isSame(today, 'day');
        const inCurrentMonth = date.month() === month;
        const dailyEvents = getEventsForDate(dateStr);

        return (
          <div key={dateStr} className={`border p-2 h-24 overflow-y-auto rounded ${inCurrentMonth ? '' : 'bg-gray-100'} ${isToday ? 'bg-yellow-100 border-yellow-500' : ''}`}>
            <div className="text-sm font-semibold">{date.date()}</div>
            {dailyEvents.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
