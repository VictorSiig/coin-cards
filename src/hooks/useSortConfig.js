import { useState } from "react";

export const useSortConfig = (fetchData) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "default" });

  const requestSort = (key) => {
  let direction = "ascending";

  if (sortConfig.key === key) {
    if (sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.direction === "descending") {
      direction = "default";
    }
  }

  if (direction === "default") {
    setSortConfig({ key: null, direction: "default" });
    fetchData(); 
  } else {
    setSortConfig({ key, direction });
  }
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
