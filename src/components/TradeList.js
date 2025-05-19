import React, { useState, useContext, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useFetchData } from "../hooks/useFetchData";
import "../styles/TradeList.css";
import TradeModal from "./TradeModal";
import SellTradeModal from "./SellTradeModal";
import { db } from "../utilities/firebase";
import { AuthContext } from "../context/AuthContext";

const TradeList = () => {
  const { user } = useContext(AuthContext);
  const {
    data: groupedTrades,
    originalData,
    error,
    loading,
    fetchData,
  } = useFetchData(user ? user.uid : null, "trades");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [tradeToSell, setTradeToSell] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "default",
  });
  const [existingCoins, setExistingCoins] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [filterConfig, setFilterConfig] = useState({
    coin: "",
    ongoing: "all",
  });

  const fetchCoinNames = async () => {
    if (!user) return;
    try {
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "trades")
      );
      const coins = new Set();
      querySnapshot.forEach((doc) => {
        coins.add(doc.data().coin);
      });
      setExistingCoins(Array.from(coins));
    } catch (err) {
      console.error("Error fetching coin names: ", err);
    }
  };

  useEffect(() => {
    fetchCoinNames();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trades: {error.message}</p>;

  const handleSell = (trade) => {
    setTradeToSell(trade);
    setIsSellModalOpen(true);
  };

  const getRowClass = (trade) => {
    if (trade.ongoing) {
      return "ongoing";
    } else if (trade.difference > 0) {
      return "positive";
    } else {
      return "negative";
    }
  };

  const parseDate = (dateString) => {
    return dateString ? new Date(dateString) : new Date(0); // Handle null dates by setting to epoch time
  };

  const sortedTrades = (trades) => {
    if (sortConfig.key && sortConfig.direction !== "default") {
      return [...trades].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key.includes("date")) {
          aValue = parseDate(aValue);
          bValue = parseDate(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return trades;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = "default";
      }
    } else {
      direction = "ascending";
    }
    setSortConfig({ key, direction });

    // Reset to original data if direction is 'default'
    if (direction === "default") {
      fetchData();
    }
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return "▲";
      } else if (sortConfig.direction === "descending") {
        return "▼";
      }
    }
    return "";
  };

  const formatProfits = (profits) => {
    if (profits == null || isNaN(profits)) return ""; // Handle null, undefined, or non-numeric values
    return parseFloat(parseFloat(profits).toFixed(2)).toString() + "%";
  };

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

  const handleDoubleClick = (tradeId, field, value) => {
    if (["profits", "difference", "tradeLasted"].includes(field)) {
      return; // Do not allow editing for these fields
    }
    setEditingField({ tradeId, field });
    setEditingValue(value);
  };

  const handleChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleBlur = async () => {
    if (!editingField) return;
    const { tradeId, field } = editingField;

    const tradeRef = doc(db, "users", user.uid, "trades", tradeId);
    const tradeDoc = await getDoc(tradeRef);

    let updatedFields = {
      [field]:
        field === "bought" || field === "sold"
          ? Number(editingValue)
          : editingValue,
    };

    if (
      field === "bought" ||
      field === "sold" ||
      field === "dateEntered" ||
      field === "dateSold"
    ) {
      const updatedTrade = { ...tradeDoc.data(), [field]: editingValue };
      const { bought, sold, dateEntered, dateSold } = updatedTrade;

      if (bought && sold) {
        updatedFields.difference = calculateDifference(
          Number(bought),
          Number(sold)
        );
        updatedFields.profits = calculateProfits(Number(bought), Number(sold));
      }
      if (dateEntered && dateSold) {
        updatedFields.tradeLasted = calculateTradeLasted(dateEntered, dateSold);
      }
    }

    await updateDoc(tradeRef, updatedFields);

    fetchData(); // Refresh data
    setEditingField(null);
    setEditingValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

      if (trades.length > 0) {
        result[coin] = trades;
      }
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
     

        <div className="filters-card">
          
        <h2>Overall Stats</h2>
          <p>Total Trades: {overallStats.totalTrades}</p>
          <p>Total Bought: $ {overallStats.totalBought}</p>
          <p>Total Sold: $ {overallStats.totalSold}</p>
          <p>Total Profits: {formatProfits(overallStats.totalProfits)}</p>
          <h3>Sort & Filter</h3>
          <div className="filters-container">
            <label>
              Filter by Coin:
              <input
                type="text"
                name="coin"
                value={filterConfig.coin}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Filter by Ongoing:
              <select
                name="ongoing"
                value={filterConfig.ongoing}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>
          <button onClick={() => setIsModalOpen(true)}>Add New Trade</button>
        </div>
      </div>
      {isModalOpen && (
        <TradeModal
          userId={user.uid}
          onClose={() => setIsModalOpen(false)}
          fetchData={fetchData}
          existingCoins={existingCoins}
          fetchCoinNames={fetchCoinNames} // Pass the function to fetch coin names
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
      {Object.keys(filteredGroupedTrades).map((coin) => {
        const trades = filteredGroupedTrades[coin] || [];
        const stats = calculateStats(trades);
        return (
          <div key={coin} className="trade-card">
            <h3>${coin.toUpperCase()}</h3>
            <div className="trade-stats">
              <p>Total Trades: {stats.totalTrades}</p>
              <p>Total Bought: $ {stats.totalBought}</p>
              <p>Total Sold: $ {stats.totalSold}</p>
              <p>Total Profits: {formatProfits(stats.totalProfits)}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort("bought")}>
                    Bought {getSortSymbol("bought")}
                  </th>
                  <th onClick={() => requestSort("sold")}>
                    Sold {getSortSymbol("sold")}
                  </th>
                  <th onClick={() => requestSort("difference")}>
                    Difference {getSortSymbol("difference")}
                  </th>
                  <th onClick={() => requestSort("profits")}>
                    Profits {getSortSymbol("profits")}
                  </th>
                  <th onClick={() => requestSort("dateEntered")}>
                    Date Entered {getSortSymbol("dateEntered")}
                  </th>
                  <th onClick={() => requestSort("dateSold")}>
                    Date Sold {getSortSymbol("dateSold")}
                  </th>
                  <th onClick={() => requestSort("tradeLasted")}>
                    Trade Lasted {getSortSymbol("tradeLasted")}
                  </th>
                  <th onClick={() => requestSort("ongoing")}>
                    Ongoing {getSortSymbol("ongoing")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTrades(trades).map((trade) => (
                  <tr key={trade.id} className={getRowClass(trade)}>
                    {[
                      "bought",
                      "sold",
                      "dateEntered",
                      "dateSold",
                      "ongoing",
                    ].map((field) => (
                      <td
                        key={field}
                        onDoubleClick={() =>
                          handleDoubleClick(trade.id, field, trade[field])
                        }
                      >
                        {editingField &&
                        editingField.tradeId === trade.id &&
                        editingField.field === field ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            autoFocus
                          />
                        ) : (
                          trade[field]
                        )}
                      </td>
                    ))}
                    <td>{trade.difference}</td>
                    <td>{formatProfits(trade.profits)}</td>
                    <td>{trade.tradeLasted}</td>
                    <td>
                      {!trade.sold && (
                        <button
                          className="sell-button"
                          onClick={() => handleSell(trade)}
                        >
                          Sell
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default TradeList;
