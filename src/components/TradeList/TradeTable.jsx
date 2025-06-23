import { getRowClass } from "../../utilities/getRowClass";
import { formatProfits } from "../../utilities/tradeUtils";
import EditableCell from "./EditableCell";

const TradeTable = ({
  trades,
  sortConfig,
  requestSort,
  getSortSymbol,
  editing,
  onSell,
  openSellModal,
}) => {
  const {
    editingField,
    editingValue,
    handleDoubleClick,
    handleChange,
    handleBlur,
    handleKeyPress,
  } = editing;

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
          <th onClick={() => requestSort("bought")}>Bought {getSortSymbol("bought")}</th>
          <th onClick={() => requestSort("sold")}>Sold {getSortSymbol("sold")}</th>
          <th onClick={() => requestSort("difference")}>Difference {getSortSymbol("difference")}</th>
          <th onClick={() => requestSort("profits")}>Profits {getSortSymbol("profits")}</th>
          <th onClick={() => requestSort("dateEntered")}>Date Entered {getSortSymbol("dateEntered")}</th>
          <th onClick={() => requestSort("dateSold")}>Date Sold {getSortSymbol("dateSold")}</th>
          <th onClick={() => requestSort("tradeLasted")}>Trade Lasted {getSortSymbol("tradeLasted")}</th>
          <th onClick={() => requestSort("ongoing")}>Ongoing {getSortSymbol("ongoing")}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedTrades.map((trade) => (
          <tr key={trade.id} className={getRowClass(trade)}>
            <EditableCell
              tradeId={trade.id}
              field="bought"
              value={trade.bought}
              editingField={editingField}
              editingValue={editingValue}
              onDoubleClick={handleDoubleClick}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
            />
            <EditableCell
              tradeId={trade.id}
              field="sold"
              value={trade.sold}
              editingField={editingField}
              editingValue={editingValue}
              onDoubleClick={handleDoubleClick}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
            />
            <td>{trade.difference}</td>
            <td>{formatProfits(trade.profits)}</td>
            <EditableCell
              tradeId={trade.id}
              field="dateEntered"
              value={trade.dateEntered}
              editingField={editingField}
              editingValue={editingValue}
              onDoubleClick={handleDoubleClick}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
            />
            <EditableCell
              tradeId={trade.id}
              field="dateSold"
              value={trade.dateSold}
              editingField={editingField}
              editingValue={editingValue}
              onDoubleClick={handleDoubleClick}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
            />
            <td>{trade.tradeLasted}</td>
            <EditableCell
              tradeId={trade.id}
              field="ongoing"
              value={String(trade.ongoing)}
              editingField={editingField}
              editingValue={editingValue}
              onDoubleClick={handleDoubleClick}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
            />
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