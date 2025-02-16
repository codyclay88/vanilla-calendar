import './style.css'
import { endOfWeek, startOfWeek, format, parse, isSameDay, differenceInMinutes, eachMinuteOfInterval } from 'date-fns'

const selectedDate = parse("2025-02-13", "yyyy-MM-dd", new Date());
const startDate = startOfWeek(selectedDate);
const endDate = endOfWeek(selectedDate);

const calendarConfig = {
  pxPerMinute: 3,
  minutesPerRow: 15,
  startTime: parse("07:00", "HH:mm", new Date()),
  endTime: parse("22:00", "HH:mm", new Date())
}

const calendarEl = document.querySelector('.calendar');

const events = [
  newEvent("2025-02-13", "7:55", "8:25", "Breakfast with Hayley"),
  newEvent("2025-02-13", "9:40", "10:00", "Travel Time"),
  newEvent("2025-02-13", "14:40", "15:00", "Travel Time"),
];

const times = eachMinuteOfInterval({
  start: calendarConfig.startTime,
  end: calendarConfig.endTime,
}, { step: calendarConfig.minutesPerRow });

const emptyTimeColumnHeader = document.createElement('div');
emptyTimeColumnHeader.classList.add('header');
calendarEl.appendChild(emptyTimeColumnHeader);

const timeColumnEl = document.createElement('div');
timeColumnEl.classList.add('content');
calendarEl.appendChild(timeColumnEl);

times.forEach(time => {
  const timeMarker = document.createElement('div');
  timeMarker.classList.add('time-indicator');
  timeMarker.innerHTML = `
    ${format(time, "h:mm a")}
  `;
  timeMarker.style.height = `${calendarConfig.pxPerMinute * calendarConfig.minutesPerRow}px`;
  timeColumnEl.appendChild(timeMarker);
});

for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
  const eventsForDate = events.filter(e => isSameDay(e.date, i));
  createDateColumn(i, calendarEl, eventsForDate);
}

function createDateColumn(date, calendarDiv, events) {
 createColumnHeader(date, calendarDiv);
 createColumnContent(calendarDiv, events);
}

function createColumnHeader(date, calendarDiv) {
  const columnHeader = document.createElement('div');
  columnHeader.classList.add('header');
  columnHeader.innerHTML = `
    <div class="dayOfWeek">${format(date, "EEEE")}</div>  
    <div class="dayOfMonth">${format(date, "d")}</div>    
  `;
  calendarDiv.appendChild(columnHeader);
}

function createColumnContent(calendarDiv, events) {
  const contentEl = document.createElement('div');
  contentEl.classList.add('content');
  times.forEach(time => {
    const timeMarker = document.createElement('div');
    timeMarker.classList.add('time-marker');
    timeMarker.style.top = `${pxSinceStartTime(calendarConfig, time)}px`;
    contentEl.appendChild(timeMarker);
  });
  events.forEach(event => {
    contentEl.appendChild(createEventElement(event));
  });
  calendarDiv.appendChild(contentEl);
}

function createEventElement(event) {
  const eventDuration = differenceInMinutes(event.stopTime, event.startTime);
  const top = pxSinceStartTime(calendarConfig, event.startTime);
  const height = eventDuration * calendarConfig.pxPerMinute;
  const eventEl = document.createElement('div');
  eventEl.classList.add('event');
  eventEl.style.height = `${height}px`;
  eventEl.style.top = `${top}px`;
  eventEl.innerHTML = `
    <div class='title'>${event.title}</div>
  `;
  return eventEl;
}

function newEvent(date, startTime, stopTime, title) {
  return {
    date: parse(date, "yyyy-MM-dd", new Date()),
    startTime: parse(startTime, "HH:mm", new Date()),
    stopTime: parse(stopTime, "HH:mm", new Date()),
    title
  }
}

function minutesSinceStartTime(config, time) {
  return differenceInMinutes(time, config.startTime);
}

function pxSinceStartTime(config, time) {
  return minutesSinceStartTime(config, time) * config.pxPerMinute;
}

// setupCounter(document.querySelector('#counter'))
