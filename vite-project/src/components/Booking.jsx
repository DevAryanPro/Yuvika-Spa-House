import React, { useState } from 'react';

function Booking() {
  const [activeTab, setActiveTab] = useState("monday");

  const schedule = {
    monday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: false },
    ],
    tuesday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: false },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: true },
    ],
    wednesday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: true },
    ],
    thursday: [
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: false },
      { time: "03:00 PM", available: true },
    ],
    friday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: false },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: false },
    ],
  };

  return (
    <section id="booking" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Available Time Slots</h2>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {Object.keys(schedule).map((day) => (
              <button
                key={day}
                onClick={() => setActiveTab(day)}
                className={`capitalize px-4 py-2 rounded-md transition-colors ${
                  activeTab === day
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <ul className="space-y-2">
              {schedule[activeTab].map((slot, idx) => (
                <li
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    slot.available
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700 line-through"
                  }`}
                >
                  <span>{slot.time}</span>
                  <span className="text-sm">
                    {slot.available ? "Available" : "Booked"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;