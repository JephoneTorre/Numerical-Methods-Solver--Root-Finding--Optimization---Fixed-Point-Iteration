import XLSX from "xlsx";

export function exportToExcel(iterations, derivative, formulaOnly, tolerance, mode) {
  const wsData = [];
  const headers = ["Iter"];

  if (mode === "fixed") {
    headers.push("pᵢ", "g(pᵢ)", "|pᵢ₊₁ - pᵢ|");
  } else {
    headers.push("a", "b", "c", mode === "root" ? "f(c)" : "h(c)");
    if (mode === "optimal") headers.push("h(a)", "h(b)", "|b-a|");
  }
  headers.push("Within Tol?");
  wsData.push(headers);

  iterations.forEach((it, i) => {
    const row = [it.iter];
    if (mode === "fixed") {
      row.push(it.pi, it.gpi, it.diff);
    } else {
      row.push(it.a, it.b, it.c, it.fc);
      if (mode === "optimal") row.push(it.fa, it.fb, Math.abs(it.b - it.a));
    }
    row.push(it.withinTol ? "TRUE" : "FALSE");
    wsData.push(row);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "NumericalMethods.xlsx");
}
