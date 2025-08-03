import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteEvent, updateEvent } from "../features/event/eventSlice";
import { toast } from "react-toastify";

function Events() {
  const events = useSelector((state) => state.event.events);
  const dispatch = useDispatch();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to compare only the date

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
  });

  const startEditing = (event) => {
    setEditId(event.id);
    setEditData({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: event.date,
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (
      !editData.title ||
      !editData.description ||
      !editData.venue ||
      !editData.date
    ) {
      toast.error("All fields are required");
      return;
    }

    const conflict = events.find(
      (e) =>
        e.id !== editId &&
        e.date === editData.date &&
        e.venue.toLowerCase() === editData.venue.toLowerCase()
    );

    if (conflict) {
      toast.error("Venue and date conflict with another event.");
      return;
    }

    dispatch(updateEvent({ ...editData, id: editId }));
    toast.success("Event updated successfully");
    setEditId(null);
    setEditData({ title: "", description: "", venue: "", date: "" });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-5">
      {events.length > 0 && (
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
      )}

      {events.map((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const isPast = eventDate < today;

        return (
          <div
            key={event.id}
            className={`shadow-lg border p-6 rounded-xl ${
              isPast
                ? "bg-red-100 border-red-300"
                : "bg-green-100 border-green-300"
            }`}
          >
            {/* Label */}
            <span
              className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${
                isPast ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {isPast ? "Past Event" : "Upcoming"}
            </span>

            {/* Edit mode */}
            {editId === event.id ? (
              <>
                <input
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <input
                  name="venue"
                  value={editData.venue}
                  onChange={handleChange}
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <input
                  type="date"
                  name="date"
                  value={editData.date}
                  onChange={handleChange}
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-purple-700">
                  {event.title}
                </h3>
                <p className="text-gray-500">
                  {new Date(event.date).toDateString()}
                </p>
                <p className="text-gray-600">📍 {event.venue}</p>
                <p className="mt-2 text-gray-700">{event.description}</p>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              {editId === event.id ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEditing(event)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => dispatch(deleteEvent(event.id))}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Events;
