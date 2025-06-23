import { useState, useContext, useEffect } from "react";
import { db } from "../../utilities/firebase";
import { AuthContext } from "../../context/AuthContext";
import { useFetchData } from "../../hooks/useFetchData";
import { useSortConfig } from "../../hooks/useSortConfig";
import { useTradeEditing } from "../../hooks/useTradeEditing";
import { calculateStats, formatProfits } from "../../utilities/tradeUtils";
import { fetchCoinNames } from "../../utilities/fetchCoinNames";
import TradeModal from "../TradeModal";
import SellTradeModal from "../SellTradeModal";
import TradeTable from "./TradeTable";
import FilterPanel from "./FilterPanel";
import StatCard from "./StatCard";
import "../../styles/TradeList.css";

const TradeListMain = () => {
  const { user } = useContext(AuthContext);
  const {
    data: groupedTrades,
    originalData,
    error,
    loading,
    fetchData,
  } = useFetchData(user?.uid, "trades");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [tradeToSell, setTradeToSell] = useState(null);
  const [existingCoins, setExistingCoins] = useState([]);
  const [filterConfig, setFilterConfig] = useState({
    coin: "",
    ongoing: "all",
  });

  const { sortConfig, requestSort, getSortSymbol } = useSortConfig(fetchData);
  const editing = useTradeEditing(user, fetchData);

  useEffect(() => {
    fetchCoinNames(user, setExistingCoins, db);
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trades: {error.message}</p>;

  const filteredGroupedTrades = Object.keys(groupedTrades).reduce(
    (result, coin) => {
      const trades = groupedTrades[coin].filter((trade) => {
        const matchesCoin = filterConfig.coin
          ? trade.coin.toLowerCase().includes(filterConfig.coin.toLowerCase())
          : true;
        const matchesOngoing =
          filterConfig.ongoing === "all" ||
          (filterConfig.ongoing === "yes" && trade.ongoing) ||
          (filterConfig.ongoing === "no" && !trade.ongoing);
        return matchesCoin && matchesOngoing;
      });
      if (trades.length > 0) result[coin] = trades;
      return result;
    },
    {}
  );

  const overallStats = calculateStats(
    Object.values(filteredGroupedTrades).flat()
  );

  return (
    <div className="trade-list-container">
      <div className="filters-card-container">
        <FilterPanel
          stats={overallStats}
          filterConfig={filterConfig}
          setFilterConfig={setFilterConfig}
          onAddTrade={() => setIsModalOpen(true)}
        />
      </div>

      {isModalOpen && (
        <TradeModal
          userId={user.uid}
          onClose={() => setIsModalOpen(false)}
          fetchData={fetchData}
          existingCoins={existingCoins}
          fetchCoinNames={fetchCoinNames}
        />
      )}

      {isSellModalOpen && (
        <SellTradeModal
          userId={user.uid}
          trade={tradeToSell}
          onClose={() => setIsSellModalOpen(false)}
          fetchData={fetchData}
        />
      )}

      {Object.entries(filteredGroupedTrades).map(([coin, trades]) => (
        <div key={coin} className="trade-card">
          <StatCard title={coin} trades={trades} />
          <TradeTable
            trades={trades}
            sortConfig={sortConfig}
            requestSort={requestSort}
            getSortSymbol={getSortSymbol}
            editing={editing}
            onSell={setTradeToSell}
            openSellModal={setIsSellModalOpen}
          />
        </div>
      ))}
    </div>
  );
};

export default TradeListMain;
