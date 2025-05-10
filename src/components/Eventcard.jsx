import React from "react";

const EventCard = ({ event }) => (
  <div className="text-sm p-1 mt-1 rounded bg-blue-100">
    {event.title} <span className="text-xs text-gray-500">({event.time})</span>
  </div>
);

export default EventCard;
