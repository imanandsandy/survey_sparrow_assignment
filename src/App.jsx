import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import './index.css';
import initialEvents from './events.json';

dayjs.extend(isoWeek);

const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedView, setSelectedView] = useState('home');
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    description: '',
    category: 'social',
    time: '',
    allDay: false
  });

  // Toggle the HTML root class for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const startDay = currentDate.startOf('month').startOf('isoWeek');
  const endDay = currentDate.endOf('month').endOf('isoWeek');
  let day = startDay.clone();
  const calendar = [];

  while (day.isBefore(endDay, 'day')) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = day.add(1, 'day');
    }
    calendar.push(week);
  }

  const isToday = (date) => dayjs().isSame(date, 'day');

  const getEventsForDay = (date) =>
    events.filter((event) => dayjs(event.date).isSame(date, 'day'));

  const getEventCategoryStyle = (category) => {
    switch (category) {
      case 'birthday':
      case 'social':
        return 'bg-green-200 dark:bg-green-500';
      case 'meeting':
      case 'deadline':
        return 'bg-blue-200 dark:bg-blue-500';
      case 'holiday':
        return 'bg-red-200 dark:bg-red-500';
      default:
        return 'bg-gray-200 dark:bg-gray-600';
    }
  };

  const handleAddEvent = () => {
    if (!modalDate) return;

    const updatedEvents = [
      ...events,
      {
        ...newEvent,
        date: modalDate.format('YYYY-MM-DD'),
      }
    ];
    setEvents(updatedEvents);
    setNewEvent({ title: '', location: '', description: '', category: 'social', time: '', allDay: false });
  };

  const handleDeleteEvent = (titleToDelete) => {
    const updated = events.filter(
      (e) => !(dayjs(e.date).isSame(modalDate, 'day') && e.title === titleToDelete)
    );
    setEvents(updated);
  };

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6">
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-8">Survey Sparrow</div>
        <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300 font-medium">
          {['home', 'programs', 'events', 'memberships', 'documents', 'payments', 'people', 'communication', 'notifications', 'search'].map((item) => (
            <button key={item} onClick={() => setSelectedView(item)} className="text-left hover:text-purple-600 dark:hover:text-purple-400">
              {item === 'home' ? '🏠' :
                item === 'events' ? '📅' :
                item === 'programs' ? '📘' :
                item === 'memberships' ? '💳' :
                item === 'documents' ? '📄' :
                item === 'payments' ? '💰' :
                item === 'people' ? '👥' :
                item === 'communication' ? '💬' :
                item === 'notifications' ? '🔔' :
                '🔍'} {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-left hover:text-purple-600 dark:hover:text-purple-400"
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </nav>

        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
          <div className="font-semibold text-black dark:text-white">Sandeep Anand</div>
          <div className="text-xs">sandy@anad.com</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-700 rounded shadow p-6">
          {selectedView === 'home' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="text-xl">←</button>
                <h1 className="text-2xl font-bold">{currentDate.format('MMMM YYYY')}</h1>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="text-xl">→</button>
                  <button
                    onClick={() => {
                      setModalDate(currentDate.startOf('day'));
                      setShowModal(true);
                    }}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-gray-600 dark:text-gray-300 font-semibold border-b pb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <div key={day}>{day}</div>)}
              </div>

              {calendar.map((week, i) => (
                <div key={i} className="grid grid-cols-7 border-b text-sm">
                  {week.map((date, idx) => {
                    const eventsForDay = getEventsForDay(date);
                    return (
                      <div
                        key={idx}
                        className={`h-24 p-2 border-r relative ${isToday(date) ? 'bg-blue-100 dark:bg-blue-800 border-blue-500' : ''} hover:bg-yellow-100 dark:hover:bg-yellow-600 cursor-pointer`}
                        onClick={() => {
                          setModalDate(date);
                          setShowModal(true);
                        }}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-300">{date.date()}</div>
                        {eventsForDay.map((event, i) => (
                          <div
                            key={i}
                            className={`text-[10px] mt-1 px-1 rounded whitespace-nowrap overflow-hidden overflow-ellipsis 
                            ${getEventCategoryStyle(event.category)} cursor-pointer 
                            transform transition-all duration-300 ease-in-out 
                            hover:scale-150 hover:opacity-100 hover:font-semibold hover:text-black`}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {selectedView === 'events' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              {events.map((event, index) => (
                <div key={index} className={`p-4 mb-3 rounded shadow ${getEventCategoryStyle(event.category)}`}>
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{dayjs(event.date).format('dddd, MMMM D, YYYY')}</p>
                  <p className="text-sm">{event.location}</p>
                  <p className="text-sm italic">{event.description}</p>
                  <p className="text-sm text-gray-600">{event.allDay ? 'All Day' : event.time}</p>
                </div>
              ))}
            </div>
          )}

          {selectedView !== 'home' && selectedView !== 'events' && (
            <div className="text-center text-gray-400">
              <p className="text-xl">🚧 {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} section under construction!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-[400px] relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-gray-600 dark:text-gray-300 text-xl">×</button>
            <h2 className="text-lg font-bold mb-3">Edit Events: {modalDate && modalDate.format('MMM D, YYYY')}</h2>

            <div className="mb-2">
              <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="w-full p-2 border rounded mb-2">
                <option value="social">Social</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="holiday">Holiday</option>
              </select>
              <input type="text" placeholder="Time (e.g., 2:00 PM)" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <label className="text-sm">
                <input type="checkbox" checked={newEvent.allDay} onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })} className="mr-2" />
                All Day
              </label>
              <button onClick={handleAddEvent} className="block w-full bg-purple-600 text-white py-2 rounded mt-3 hover:bg-purple-700">Add Event</button>
            </div>

            <div className="mt-4 border-t pt-2">
              <p className="font-semibold mb-2">Existing Events:</p>
              {getEventsForDay(modalDate).map((event, i) => (
                <div key={i} className="flex justify-between items-center text-sm mb-1">
                  <span>{event.title}</span>
                  <button onClick={() => handleDeleteEvent(event.title)} className="text-red-600 hover:text-red-800 text-xs">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
