import { parse, format, differenceInMinutes } from "date-fns";
import { getConfig } from "./config";

export class CalendarEventController {
  constructor(eventEl) {
    this.eventEl = eventEl;
  }

  get eventId() {
    return this.eventEl.dataset.eventId;
  }

  set eventId(value) {
    this.eventEl.dataset.eventId = value;
  }

  get title() {
    return this.eventEl.querySelector(".title").textContent;
  }

  set title(value) {
    this.eventEl.querySelector(".title").textContent = value;
  }

  get startTime() {
    return parse(
      this.eventEl.querySelector(".starts-at").textContent,
      "h:mm a",
      new Date()
    );
  }

  set startTime(value) {
    this.eventEl.querySelector(".starts-at").textContent = format(
      value,
      "h:mm a"
    );
  }

  get endTime() {
    return parse(
      this.eventEl.querySelector(".ends-at").textContent,
      "h:mm a",
      new Date()
    );
  }

  set endTime(value) {
    this.eventEl.querySelector(".ends-at").textContent = format(
      value,
      "h:mm a"
    );
  }

  get duration() {
    return differenceInMinutes(this.endTime, this.startTime);
  }

  get minutesSinceStartTime() {
    return differenceInMinutes(this.startTime, this.config.startTime);
  }

  draw() {
    const top = this.minutesSinceStartTime * this.config.pxPerMinute;
    const height = this.duration * this.config.pxPerMinute;
    this.eventEl.style.height = `${height}px`;
    this.eventEl.style.top = `${top}px`;
  }

  commit(updateFn) {
    updateFn(this);
    this.draw();
  }

  get config() {
    return getConfig();
  }
}
