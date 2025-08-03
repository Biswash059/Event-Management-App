import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../features/event/eventSlice";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import TextInput from "../components/TextInput";
import TextareaInput from "../components/TextareaInput";

function AddEvent() {
  const events = useSelector((state) => state.event.events);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, venue, date } = formData;
    if (!title || !description || !venue || !date) {
      toast.error("All fields are required");
      return;
    }
    const isConflict = events.some(
      (event) =>
        event.date === date && event.venue.toLowerCase() === venue.toLowerCase()
    );

    if (isConflict) {
      toast.error("Event conflict! Same venue and date already exist.");
      return;
    }

    const newEvent = {
      ...formData,
      id: uuidv4(),
    };

    dispatch(addEvent(newEvent));
    toast.success("Event added successfully");
    setFormData({ title: "", description: "", venue: "", date: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-2xl border border-gray-200 space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Create Event
      </h2>

      <TextInput
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
      />

      <TextareaInput
        name="description"
        placeholder="Event Description"
        value={formData.description}
        onChange={handleChange}
      />

      <TextInput
        name="venue"
        placeholder="Event Venue"
        value={formData.venue}
        onChange={handleChange}
      />

      <TextInput
        name="date"
        type="Date"
        value={formData.date}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        Add Event
      </button>

      {error && <p className="text-center text-red-500 font-medium">{error}</p>}
    </form>
  );
}

export default AddEvent;
