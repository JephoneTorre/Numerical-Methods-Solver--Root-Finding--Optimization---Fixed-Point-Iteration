import * as XLSX from "xlsx";

// Helper to write either value or formula
function addCell(wsData, rowIndex, colIndex, content) {
  if (typeof content === "object" && content.formula) {
    wsData[rowIndex][colIndex] = { f: content.formula };
  } else {
    wsData[rowIndex][colIndex] = content.value ?? content;
  }
}

export function exportToExcel(type, iterations) {
  const wsData = [];
  if (type === "root") {
    wsData.push([
      "Iter", "a", "b", "c", "f(a)", "f(b)", "f(c)", "Within Tol"
    ]);
    iterations.forEach((it, idx) => {
      wsData.push([
        idx,
        it.a.value,
        it.b.value,
        it.c.value,
        it.fa.value,
        it.fb.value,
        it.fc.value,
        { f: `IF(ABS(G${idx+2})<$N$4,TRUE,FALSE)` } // tolerance check
      ]);
    });
  }

  if (type === "optimization") {
    wsData.push([
      "Iter", "a", "b", "c", "f(a)", "f(b)", "f(c)", "b-a", "Within Tol", "New a", "New b"
    ]);
    iterations.forEach((it, idx) => {
      const row = idx + 2;
      wsData.push([
        idx,
        it.a.value,
        it.b.value,
        it.c.value,
        it.fa.value,
        it.fb.value,
        it.fc.value,
        { f: `ABS(C${row}-B${row})` },                      // b-a
        { f: `IF(H${row}<$N$4,TRUE,FALSE)` },              // tolerance check
        { f: `IF(E${row}*G${row}<0,B${row},D${row})` },     // new a
        { f: `IF(F${row}*G${row}>0,C${row},D${row})` }      // new b
      ]);
    });
  }

  if (type === "fixed") {
    wsData.push([
      "Iter", "p(i)", "g(p(i))", "|p(i+1)-p(i)|", "Within Tol"
    ]);
    iterations.forEach((it, idx) => {
      const row = idx + 2;
      wsData.push([
        idx,
        it.pi.value,
        it.gpi.value,
        { f: `ABS(C${row}-B${row})` }, // diff as formula
        { f: `IF(D${row}<$N$4,TRUE,FALSE)` }
      ]);
    });
  }

  // Create sheet and workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "NumericalMethods.xlsx");
}
