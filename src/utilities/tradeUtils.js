const calculateStats = (trades) => {
  const filteredTrades = trades.filter((trade) => !trade.ongoing);
  const totalBought = filteredTrades.reduce(
    (sum, trade) => sum + Number(trade.bought || 0),
    0
  );
  const totalSold = filteredTrades.reduce(
    (sum, trade) => sum + Number(trade.sold || 0),
    0
  );
  const totalTrades = trades.length;
  const totalProfits =
    totalBought > 0 ? ((totalSold - totalBought) / totalBought) * 100 : 0; // Calculate the percentage difference

  return { totalBought, totalSold, totalTrades, totalProfits };
};

const calculateDifference = (bought, sold) => sold - bought;

const calculateProfits = (bought, sold) => ((sold - bought) / bought) * 100;

const calculateTradeLasted = (dateEntered, dateSold) => {
  const entered = parseDate(dateEntered);
  const sold = parseDate(dateSold);
  return Math.ceil((sold - entered) / (1000 * 60 * 60 * 24)); // Difference in days
};

const parseDate = (dateString) => {
  return dateString ? new Date(dateString) : new Date(0); // Handle null dates by setting to epoch time
};

const formatProfits = (profits) => {
  if (profits == null || isNaN(profits)) return ""; // Handle null, undefined, or non-numeric values
  return parseFloat(parseFloat(profits).toFixed(2)).toString() + "%";
};


export {calculateStats, calculateDifference, calculateProfits, calculateTradeLasted, parseDate, formatProfits}