export const truncateText = (text, limit = 100) => {
  if (text.length <= limit) return text;

  return text.substring(0, limit) + "...";
};
