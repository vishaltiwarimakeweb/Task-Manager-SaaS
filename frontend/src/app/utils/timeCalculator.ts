export const timeCalc = (miliseconds: number) => {
  const currMs = Date.now();
  const difference = currMs - miliseconds;
  if (difference >= 946080000000) {
    const yearsDiff = Math.ceil(difference / 946080000000);
    return `${yearsDiff} years ago`;
  }
  if (difference >= 2592000000) {
    const monthsDiff = Math.ceil(difference / 2592000000);
    return `${monthsDiff} months ago`;
  }
  if (difference >= 86400000) {
    const daysDiff = Math.ceil(difference / 86400000);
    return `${daysDiff} days ago`;
  }
  if (difference >= 3600000) {
    const hoursDiff = Math.ceil(difference / 3600000);
    return `${hoursDiff} hours ago`;
  }
  if (difference >= 60000) {
    const minutesDiff = Math.ceil(difference / 60000);
    return `${minutesDiff} minutes ago`;
  }
  if (difference >= 1000) {
    const secondsDiff = Math.ceil(difference / 1000);
    return `${secondsDiff} seconds ago`;
  }
  if (difference >= 0) {
    return `0 seconds ago`;
  }
};
