import { getRowClass } from "../../utilities/getRowClass";
import { formatProfits } from "../../utilities/tradeUtils";

const TradeTable = ({
  trades,
  sortConfig,
  requestSort,
  getSortSymbol,
  editing,
  onSell,
  openSellModal,
}) => {
  const { editingField, editingValue, handleDoubleClick, handleChange, handleBlur, handleKeyPress } =
    editing;

  const sortedTrades = [...trades].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    if (sortConfig.key?.includes("date")) {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  return (
    <table>
      <thead>
        <tr>
          {["bought", "sold", "difference", "profits", "dateEntered", "dateSold", "tradeLasted", "ongoing"].map((field) => (
            <th key={field} onClick={() => requestSort(field)}>
              {field.charAt(0).toUpperCase() + field.slice(1)} {getSortSymbol(field)}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedTrades.map((trade) => (
          <tr key={trade.id} className={getRowClass(trade)}>
            {["bought", "sold", "dateEntered", "dateSold", "ongoing"].map((field) => (
              <td
                key={field}
                onDoubleClick={() => handleDoubleClick(trade.id, field, trade[field])}
              >
                {editingField?.tradeId === trade.id && editingField.field === field ? (
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
                  onClick={() => {
                    onSell(trade);
                    openSellModal(true);
                  }}
                >
                  Sell
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TradeTable;
