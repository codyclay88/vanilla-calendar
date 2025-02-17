import {
  format,
  startOfWeek,
  endOfWeek,
  parse,
  isSameDay,
  differenceInMinutes,
  eachMinuteOfInterval,
} from "date-fns";

export function buildCalendar(calendarEl, date, events) {
  calendarEl.innerHTML = "";
  const startDate = startOfWeek(date);
  const endDate = endOfWeek(date);
  const config = getCalendarConfig(calendarEl);

  const times = eachMinuteOfInterval(
    {
      start: config.startTime,
      end: config.endTime,
    },
    { step: config.minutesPerRow }
  );

  const emptyTimeColumnHeader = document.createElement("div");
  emptyTimeColumnHeader.classList.add("header");
  calendarEl.appendChild(emptyTimeColumnHeader);

  const timeColumnEl = document.createElement("div");
  timeColumnEl.classList.add("content");
  calendarEl.appendChild(timeColumnEl);

  times.forEach((time) => {
    const timeMarker = document.createElement("div");
    timeMarker.classList.add("time-indicator");
    timeMarker.innerHTML = `
      ${format(time, "h:mm a")}
    `;
    timeMarker.style.height = `${config.pxPerMinute * config.minutesPerRow}px`;
    timeColumnEl.appendChild(timeMarker);
  });

  for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    const eventsForDate = events.filter((e) => isSameDay(e.date, i));
    createDateColumn(i, calendarEl, config, times, eventsForDate);
  }
}

function createDateColumn(date, calendarDiv, config, times, events) {
  createColumnHeader(date, calendarDiv);
  createColumnContent(calendarDiv, config, times, events);
}

function createColumnHeader(date, calendarDiv) {
  const template = document.querySelector("#column-header-template");
  const el = template.content.cloneNode(true);
  el.querySelector(".dayOfWeek").textContent = format(date, "EEEE");
  el.querySelector(".dayOfMonth").textContent = format(date, "d");
  calendarDiv.appendChild(el);
}

function createColumnContent(calendarDiv, config, times, events) {
  const template = document.querySelector("#column-content-template");
  const clone = template.content.cloneNode(true);
  const el = clone.querySelector(".content");
  const documentFragment = document.createDocumentFragment();
  times.forEach((time) => {
    const timeMarker = document.createElement("div");
    timeMarker.classList.add("time-marker");
    timeMarker.style.top = `${pxSinceStartTime(config, time)}px`;
    documentFragment.appendChild(timeMarker);
  });
  const eventContainer = clone.querySelector(".event-container");

  events.forEach((event) => {
    eventContainer.appendChild(createEventElement(event, config));
  });
  calendarDiv.appendChild(el);
  el.insertBefore(documentFragment, eventContainer);
}

function createEventElement(event, config) {
  const eventTemplate = document.querySelector("#event-template");
  const clone = eventTemplate.content.cloneNode(true);
  const eventEl = clone.querySelector(".event");
  eventEl.querySelector(".title").textContent = event.title;
  eventEl.querySelector(".starts-at").textContent = `${format(
    event.startTime,
    "h:mm a"
  )}`;
  eventEl.querySelector(".ends-at").textContent = `${format(
    event.stopTime,
    "h:mm a"
  )}`;
  const eventDuration = differenceInMinutes(event.stopTime, event.startTime);
  const top = pxSinceStartTime(config, event.startTime);
  const height = eventDuration * config.pxPerMinute;

  eventEl.classList.add("event");
  eventEl.style.height = `${height}px`;
  eventEl.style.top = `${top}px`;
  return eventEl;
}

function pxSinceStartTime(config, time) {
  return minutesSinceStartTime(config, time) * config.pxPerMinute;
}

function minutesSinceStartTime(config, time) {
  return differenceInMinutes(time, config.startTime);
}

export function getCalendarConfig(calendarEl) {
  return {
    pxPerMinute: calendarEl.dataset.pxPerMinute || 3,
    minutesPerRow: calendarEl.dataset.minutesPerRow || 15,
    startTime: parse(
      calendarEl.dataset.startTime ?? "07:00",
      "HH:mm",
      new Date()
    ),
    endTime: parse(calendarEl.dataset.endTime ?? "22:00", "HH:mm", new Date()),
  };
}

export function updateCalendarConfig(calendarEl, config) {
  calendarEl.dataset.pxPerMinute = config.pxPerMinute;
  calendarEl.dataset.minutesPerRow = config.minutesPerRow;
  calendarEl.dataset.startTime = format(config.startTime, "HH:mm");
  calendarEl.dataset.endTime = format(config.endTime, "HH:mm");
}
