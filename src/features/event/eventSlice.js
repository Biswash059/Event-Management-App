import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  events: [],
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      const { date, venue } = action.payload;

      const conflict = state.events.find(
        (e) => e.date === date && e.venue.toLowerCase() === venue.toLowerCase()
      );

      if (conflict) {
        throw new Error(
          "Another event is already scheduled at this venue and date."
        );
      }

      const newEvent = { ...action.payload, id: uuidv4() };
      state.events.push(newEvent);
    },

    updateEvent: (state, action) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        const conflict = state.events.find(
          (e) =>
            e.id !== action.payload.id &&
            e.date === action.payload.date &&
            e.venue.toLowerCase() === action.payload.venue.toLowerCase()
        );
        if (conflict) {
          throw new Error("Venue and date conflict with another event.");
        }
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
