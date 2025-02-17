import "./style.css";
import {
  buildCalendar,
  getCalendarConfig,
  updateCalendarConfig,
} from "./calendar.js";
import { format, parse } from "date-fns";

const selectedDate = parse("2025-02-13", "yyyy-MM-dd", new Date());

const calendarEl = document.querySelector(".calendar");

const calendarConfig = getCalendarConfig(calendarEl);

document.querySelector("#startTime").value = format(
  calendarConfig.startTime,
  "HH:mm"
);
document.querySelector("#endTime").value = format(
  calendarConfig.endTime,
  "HH:mm"
);
document.querySelector("#pxPerMinute").value = calendarConfig.pxPerMinute;
document.querySelector("#minutesPerRow").value = calendarConfig.minutesPerRow;

document.querySelector("#configForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const newConfig = {
    ...calendarConfig,
    startTime: parse(formData.get("startTime"), "HH:mm", new Date()),
    endTime: parse(formData.get("endTime"), "HH:mm", new Date()),
    pxPerMinute: formData.get("pxPerMinute"),
    minutesPerRow: formData.get("minutesPerRow"),
  };
  updateCalendarConfig(calendarEl, newConfig);
  buildCalendar(calendarEl, selectedDate, events);
});

const events = [
  newEvent("2025-02-13", "7:55", "8:25", "Breakfast with Hayley"),
  newEvent("2025-02-13", "9:40", "10:00", "Travel Time"),
  newEvent("2025-02-13", "14:40", "15:00", "Travel Time"),
];

buildCalendar(calendarEl, selectedDate, events);

function newEvent(date, startTime, stopTime, title) {
  return {
    date: parse(date, "yyyy-MM-dd", new Date()),
    startTime: parse(startTime, "HH:mm", new Date()),
    endTime: parse(stopTime, "HH:mm", new Date()),
    title,
  };
}
