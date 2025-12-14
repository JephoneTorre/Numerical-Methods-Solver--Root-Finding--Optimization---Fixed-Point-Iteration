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

  if (type === "root" || type === "optimal") {
    wsData.push([
      "Iter", "a", "b", "c", "f(a)", "f(b)", "f(c)", "b-a", "Within Tol"
    ]);

    iterations.forEach((it, idx) => {
      wsData.push([
        idx,
        it.a.value,
        it.b.value,
        it.c.value,
        it.fa?.value ?? "",
        it.fb?.value ?? "",
        it.fc?.value ?? "",
        it.diff?.value ?? "",
        it.withinTol ? "TRUE" : "FALSE"
      ]);
    });
  }

  if (type === "fixed") {
    wsData.push([
      "Iter", "p(i)", "g(p(i))", "|p(i+1)-p(i)|", "Within Tol"
    ]);
    iterations.forEach((it, idx) => {
      wsData.push([
        idx,
        it.pi.value,
        it.gpi.value,
        it.diff.value,
        it.withinTol ? "TRUE" : "FALSE"
      ]);
    });
  }

  if (type === "gss") {
    wsData.push([
      "Iter", "a", "b", "a'", "b'", "f(a')", "f(b')", "|b-a|", "Within Tol"
    ]);
    iterations.forEach((it, idx) => {
      wsData.push([
        idx,
        it.a.value,
        it.b.value,
        it.a1.value,
        it.b1.value,
        it.fa1.value,
        it.fb1.value,
        it.diff.value,
        it.withinTol ? "TRUE" : "FALSE"
      ]);
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "NumericalMethods.xlsx");
}
