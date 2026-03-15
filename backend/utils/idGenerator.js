const generateId = (prefix, count, padLength = 4) => {
  return `MYFIN-${prefix}-${String(count).padStart(padLength, "0")}`;
};

module.exports = generateId;