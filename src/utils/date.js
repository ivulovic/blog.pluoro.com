export function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  function makePlural(number, period) {
    const n = Math.floor(number);
    switch (period) {
      default:
        return `${n} ${period}${period % 2 == 0 ? "" : "s"} ago`;// n + " " + period + period % 2 == 0 ? "s" : "" + " ago";
    }
  }

  if (interval > 1) {
    return makePlural(interval, 'year')
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return makePlural(interval, 'minute')
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return makePlural(interval, 'day')
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return makePlural(interval, 'hour')
  }
  interval = seconds / 60;
  if (interval > 1) {
    return makePlural(interval, 'minute')
  }
  return makePlural(interval, 'second')
}

