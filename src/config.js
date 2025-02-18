import { parse } from "date-fns";

export function getConfig() {
  const configForm = document.querySelector("#configForm");

  return {
    date: parse(
      configForm.querySelector("[name=date]").value,
      "yyyy-MM-dd",
      new Date()
    ),
    startTime: parse(
      configForm.querySelector("[name=startTime]").value,
      "HH:mm",
      new Date()
    ),
    endTime: parse(
      configForm.querySelector("[name=endTime]").value,
      "HH:mm",
      new Date()
    ),
    pxPerMinute: configForm.querySelector("[name=pxPerMinute]").value,
    minutesPerRow: configForm.querySelector("[name=minutesPerRow]").value,
  };
}
