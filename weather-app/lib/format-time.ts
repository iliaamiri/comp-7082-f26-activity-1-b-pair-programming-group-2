// OpenWeatherMap gives times as UTC unix seconds + a city timezone offset
// (seconds from UTC). The browser's Date always renders in the *viewer's*
// local timezone, which is wrong here - we want the city's local time.
export function cityTime(unixSeconds: number, timezoneOffsetSeconds: number) {
  const utcMs = unixSeconds * 1000;
  const cityMs = utcMs + timezoneOffsetSeconds * 1000;
  return new Date(cityMs).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function cityHour(unixSeconds: number, timezoneOffsetSeconds: number) {
  const utcMs = unixSeconds * 1000;
  const cityMs = utcMs + timezoneOffsetSeconds * 1000;
  return new Date(cityMs).toLocaleTimeString("en-US", {
    hour: "numeric",
    timeZone: "UTC",
  });
}

export function cityWeekday(unixSeconds: number, timezoneOffsetSeconds: number) {
  const utcMs = unixSeconds * 1000;
  const cityMs = utcMs + timezoneOffsetSeconds * 1000;
  return new Date(cityMs).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}
