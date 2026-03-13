export const formatDate = (date) => {
  const newDate = new Date(date);

  return newDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
