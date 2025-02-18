import "./style.css";
import { buildCalendar, CalendarEventInterceptor } from "./calendar.js";
import { parse } from "date-fns";
import { ConfigFormInterceptor } from "./config-form.js";

const calendarEl = document.querySelector(".calendar");

const events = [
  newEvent(1, "2025-02-13", "7:55", "8:25", "Breakfast with Hayley"),
  newEvent(2, "2025-02-13", "9:40", "10:00", "Travel Time"),
  newEvent(3, "2025-02-13", "14:40", "15:00", "Travel Time"),
];

new ConfigFormInterceptor(document.querySelector("#configForm"));
new CalendarEventInterceptor(calendarEl);

buildCalendar(calendarEl, events);

function newEvent(id, date, startTime, stopTime, title) {
  return {
    id,
    date: parse(date, "yyyy-MM-dd", new Date()),
    startTime: parse(startTime, "HH:mm", new Date()),
    endTime: parse(stopTime, "HH:mm", new Date()),
    title,
  };
}
