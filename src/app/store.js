import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/event/eventSlice";
import eventReducer from "../features/event/eventSlice";

const saveToLocalStorage = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem("event_state", serialized);
  } catch (e) {
    console.warn("Could not save state", e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem("event_state");
    if (serialized === null) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    event: eventReducer,
  },
  preloadedState: loadFromLocalStorage(),
});

// Listen to state changes
store.subscribe(() => {
  saveToLocalStorage({
    event: store.getState().event,
  });
});


export default store;