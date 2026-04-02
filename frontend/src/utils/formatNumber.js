const formatNumber = (num) => {
  if (!num) return 0;

  const format = (n, suffix) => {
    const val = (num / n).toFixed(1);
    return val.endsWith(".0") ? parseInt(val) + suffix : val + suffix;
  };

  if (num >= 1_000_000) return format(1_000_000, "M");
  if (num >= 1_000) return format(1_000, "k");

  return num;
};

export default formatNumber;
