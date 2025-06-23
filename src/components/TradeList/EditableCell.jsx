const EditableCell = ({
  tradeId,
  field,
  value,
  editingField,
  editingValue,
  onDoubleClick,
  onChange,
  onBlur,
  onKeyPress,
}) => {
  const isEditing =
    editingField?.tradeId === tradeId && editingField.field === field;

  return (
    <td onDoubleClick={() => onDoubleClick(tradeId, field, value)}>
      {isEditing ? (
        <input
          type="text"
          value={editingValue}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          autoFocus
        />
      ) : (
        value?.toString()
      )}
    </td>
  );
};

export default EditableCell;
