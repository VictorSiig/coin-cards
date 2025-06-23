const getRowClass = (trade) => {
  if (trade.ongoing) {
    return "ongoing";
  } else if (trade.difference > 0) {
    return "positive";
  } else {
    return "negative";
  }
};

export { getRowClass };
