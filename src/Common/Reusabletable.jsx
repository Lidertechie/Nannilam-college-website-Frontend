import React from "react";

const styles = {
  tableWrapper: {
    width: "100%",
    overflowX: "auto",     // Horizontal scroll
    overflowY: "auto",     // Vertical scroll (if needed)
    maxHeight: "500px",    // Set height for vertical scrolling
    border: "1px solid #d1d5db",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    minWidth: "800px",     // Adjust based on number of columns
    borderCollapse: "collapse",
    marginBottom: "0",
    fontSize: "14.5px",
  },
  th: {
    backgroundColor: "#1a3e8c",
    color: "#fff",
    padding: "10px 8px",
    border: "1px solid #d1d5db",
    textAlign: "center",
    position: "sticky",    // Sticky header
    top: 0,
    zIndex: 1,
  },
  td: {
    padding: "9px 8px",
    border: "1px solid #d1d5db",
    textAlign: "center",
  },
  totalRow: {
    backgroundColor: "#f3f4f6",
    fontWeight: 700,
  },
};

export default function HistoryTable({
  headers = [],
  rows = [],
  totalRow = null,
}) {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((label, i) => (
              <th style={styles.th} key={i}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((val, j) => (
                <td style={styles.td} key={j}>
                  {val}
                </td>
              ))}
            </tr>
          ))}

          {totalRow && (
            <tr style={styles.totalRow}>
              {totalRow.map((val, j) => (
                <td style={styles.td} key={j}>
                  {val}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}