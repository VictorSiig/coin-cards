const FilterPanel = ({ stats, filterConfig, setFilterConfig, onAddTrade }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters-card">
      <h2>Overall Stats</h2>
      <p>Total Trades: {stats.totalTrades}</p>
      <p>Total Bought: $ {stats.totalBought}</p>
      <p>Total Sold: $ {stats.totalSold}</p>
      <p>Total Profits: {stats.totalProfits}</p>

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

      <button onClick={onAddTrade}>Add New Trade</button>
    </div>
  );
};

export default FilterPanel;
