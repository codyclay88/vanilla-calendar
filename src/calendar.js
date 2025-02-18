import {
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  eachMinuteOfInterval,
  add,
} from "date-fns";
import { CalendarEventController } from "./calendar-event";
import { TimeMarkerController } from "./time-marker";
import { getConfig } from "./config";

function getTimeAtY(y) {
  const config = getConfig();
  const minutesSinceStart = y / config.pxPerMinute;
  const time = new Date(config.startTime);
  time.setMinutes(minutesSinceStart);
  return time;
}

export function buildCalendar(calendarEl, events) {
  calendarEl.innerHTML = "";
  const config = getConfig();
  const date = config.date;
  const startDate = startOfWeek(date);
  const endDate = endOfWeek(date);

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
  new CalendarColumnEventInterceptor(el);
  const documentFragment = document.createDocumentFragment();
  times.forEach((time) => {
    const timeMarker = document.createElement("div");
    const timeMarkerCtrl = new TimeMarkerController(timeMarker);
    timeMarkerCtrl.time = time;
    timeMarkerCtrl.draw();
    documentFragment.appendChild(timeMarker);
  });
  const eventContainer = clone.querySelector(".event-container");

  events.forEach((event) => {
    eventContainer.appendChild(createEventElement(event, config));
  });
  calendarDiv.appendChild(el);
  el.insertBefore(documentFragment, eventContainer);
}

function createEventElement(event) {
  const eventTemplate = document.querySelector("#event-template");
  const clone = eventTemplate.content.cloneNode(true);
  const eventEl = clone.querySelector(".event");
  const eventCtrl = new CalendarEventController(eventEl);
  eventCtrl.title = event.title;
  eventCtrl.startTime = event.startTime;
  eventCtrl.endTime = event.endTime;
  eventCtrl.draw();

  return eventEl;
}

export class CalendarController {
  constructor(calendarEl) {
    this.calendarEl = calendarEl;
  }

  get events() {
    return Array.from(this.calendarEl.querySelectorAll(".event"));
  }

  draw() {}
}

export class CalendarColumnEventInterceptor {
  constructor(columnEl) {
    columnEl.addEventListener("dragstart", this.onDragStart.bind(this));
    // columnEl.addEventListener("dragenter", this.onDragEnter.bind(this));
    columnEl.addEventListener("drag", this.onDrag.bind(this));
    columnEl.addEventListener("dragend", this.onDragEnd.bind(this));
  }

  onDragStart(e) {
    var img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="; // 1x1 pixel transparent gif

    // Set the drag image to the invisible element
    e.dataTransfer.setDragImage(img, 0, 0);
    e.target.dataset.dragging = true;
    this.offsetY = e.offsetY;
  }

  onDrag(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.x === 0 && e.y === 0) {
      return;
    }

    const eventController = new CalendarEventController(e.target);

    const adjustedY =
      e.y - e.currentTarget.getBoundingClientRect().top - this.offsetY;

    const newStartTime = getTimeAtY(adjustedY);
    const newEndTime = add(newStartTime, { minutes: eventController.duration });

    eventController.commit((ctrl) => {
      ctrl.startTime = newStartTime;
      ctrl.endTime = newEndTime;
    });
  }

  onDragEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.dataset.dragging = false;
    this.offsetY = 0;
  }
}

export class CalendarEventInterceptor {
  constructor() {
    this.isDragging = false;
    this.originalY = 0;
    this.originalHeight = 0;
    this.containerTop = 0;

    document.addEventListener("configChange", this.onConfigChange.bind(this));
  }

  onConfigChange(e) {
    e.preventDefault();

    calendarCtrl.draw();
  }
}
