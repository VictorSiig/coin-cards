import { useState } from "react";

export const useSortConfig = (fetchData) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "default" });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "default";
    }
    setSortConfig({ key, direction });
    if (direction === "default") fetchData();
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending"
        ? "▲"
        : sortConfig.direction === "descending"
        ? "▼"
        : "";
    }
    return "";
  };

  return { sortConfig, requestSort, getSortSymbol };
};
