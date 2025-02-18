import { format, parse, differenceInMinutes } from "date-fns";
import { getConfig } from "./config";

export class TimeMarkerController {
  constructor(timeMarkerEl) {
    this.timeMarkerEl = timeMarkerEl;
    this.timeMarkerEl.classList.add("time-marker");
  }

  get time() {
    return parse(this.timeMarkerEl.dataset.time, "h:mm a", new Date());
  }

  set time(value) {
    this.timeMarkerEl.dataset.time = format(value, "h:mm a");
  }

  get config() {
    return getConfig();
  }

  draw() {
    const minutesSinceStartTime = differenceInMinutes(
      this.time,
      this.config.startTime
    );
    const pxSinceStartTime = minutesSinceStartTime * this.config.pxPerMinute;
    this.timeMarkerEl.style.top = `${pxSinceStartTime}px`;
  }
}
