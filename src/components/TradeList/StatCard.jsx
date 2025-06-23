import { calculateStats, formatProfits } from "../../utilities/tradeUtils";

const StatCard = ({ title, trades }) => {
  const stats = calculateStats(trades);

  return (
    <>
      <h3>${title.toUpperCase()}</h3>
      <div className="trade-stats">
        <p>Total Trades: {stats.totalTrades}</p>
        <p>Total Bought: $ {stats.totalBought}</p>
        <p>Total Sold: $ {stats.totalSold}</p>
        <p>Total Profits: {formatProfits(stats.totalProfits)}</p>
      </div>
    </>
  );
};

export default StatCard;
