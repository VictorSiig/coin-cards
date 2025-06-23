import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { calculateDifference, calculateProfits, calculateTradeLasted } from "../utilities/tradeUtils";
import { db } from "../utilities/firebase";

export const useTradeEditing = (user, fetchData) => {
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const handleDoubleClick = (tradeId, field, value) => {
    if (["profits", "difference", "tradeLasted"].includes(field)) return;
    setEditingField({ tradeId, field });
    setEditingValue(value);
  };

  const handleChange = (e) => setEditingValue(e.target.value);

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

    const updatedTrade = { ...tradeDoc.data(), [field]: editingValue };
    if (updatedTrade.bought && updatedTrade.sold) {
      updatedFields.difference = calculateDifference(updatedTrade.bought, updatedTrade.sold);
      updatedFields.profits = calculateProfits(updatedTrade.bought, updatedTrade.sold);
    }
    if (updatedTrade.dateEntered && updatedTrade.dateSold) {
      updatedFields.tradeLasted = calculateTradeLasted(updatedTrade.dateEntered, updatedTrade.dateSold);
    }

    await updateDoc(tradeRef, updatedFields);
    fetchData();
    setEditingField(null);
    setEditingValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleBlur();
  };

  return {
    editingField,
    editingValue,
    handleDoubleClick,
    handleChange,
    handleBlur,
    handleKeyPress,
  };
};
