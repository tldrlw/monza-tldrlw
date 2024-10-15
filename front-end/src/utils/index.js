export function formatToHumanReadable(isoString) {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long", // Full month name (e.g., September)
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short", // Includes time zone (e.g., GMT)
  };
  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// Sort by DateTime in descending order (most recent first)
export function sortDataByTime(data) {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.DateTime.S);
    const dateB = new Date(b.DateTime.S);
    return dateB - dateA;
  });
}
