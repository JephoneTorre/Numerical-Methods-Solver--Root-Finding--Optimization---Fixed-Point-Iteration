"use client";

import { useState } from "react";
import { evaluate } from "mathjs";
import { runRootFinding, runOptimization, runFixedPoint, getDerivative } from "../../lib/mathUtils";
import { exportToExcel } from "../../lib/excelUtils";

function formatValue(v) {
  if (typeof v === "number") return Math.round(v * 1e6) / 1e6;
  return v;
}

export default function HomePage() {
  const [func, setFunc] = useState("8*e^(1-x) + 7*log(x)");
  const [a, setA] = useState("1");
  const [b, setB] = useState("2");
  const [tolerance, setTolerance] = useState("0.0001");
  const [mode, setMode] = useState("root");
  const [showTolCheck, setShowTolCheck] = useState(true);
  const [formulaOnly, setFormulaOnly] = useState(false);
  const [showFormulaPreview, setShowFormulaPreview] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    try {
      setError("");
      const derivativeVal = getDerivative(func);
      let output;

      const start = parseFloat(a);
      const end = parseFloat(b);

      if (mode === "root") {
        const fa = evaluate(func, { x: start });
        const fb = evaluate(func, { x: end });
        if (fa * fb > 0) {
          output = runOptimization(func, start, end, parseFloat(tolerance));
        } else {
          output = runRootFinding(func, start, end, parseFloat(tolerance));
        }
      } else if (mode === "optimal") {
        output = runOptimization(func, start, end, parseFloat(tolerance));
      } else {
        output = runFixedPoint(func, start, parseFloat(tolerance));
      }

      setResult({ ...output, derivative: derivativeVal });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Numerical Methods Calculator</h1>

      <label className="font-semibold">Calculation Type:</label>
      <select className="border p-2 w-full mb-2" value={mode} onChange={e => setMode(e.target.value)}>
        <option value="root">Root Finding (Bisection)</option>
        <option value="optimal">Optimization (Interval)</option>
        <option value="fixed">Fixed Point Iteration g(x)</option>
      </select>

      <label className="font-semibold">Function f(x):</label>
      <input className="border p-2 w-full mb-2" value={func} onChange={e => setFunc(e.target.value)} />

      {mode !== "fixed" && (
        <div className="flex gap-2 mb-2">
          <input className="border p-2 w-full" value={a} onChange={e => setA(e.target.value)} placeholder="a" />
          <input className="border p-2 w-full" value={b} onChange={e => setB(e.target.value)} placeholder="b" />
        </div>
      )}

      {mode === "fixed" && (
        <input className="border p-2 w-full mb-2" value={a} onChange={e => setA(e.target.value)} placeholder="Initial guess p0" />
      )}

      <label className="font-semibold">Tolerance:</label>
      <input className="border p-2 w-full mb-2" value={tolerance} onChange={e => setTolerance(e.target.value)} />

      <div className="flex gap-2 mb-4">
        <label><input type="checkbox" checked={showTolCheck} onChange={() => setShowTolCheck(!showTolCheck)} /> Show tolerance check</label>
        <label><input type="checkbox" checked={formulaOnly} onChange={() => setFormulaOnly(!formulaOnly)} /> Export formula-only Excel</label>
        <label><input type="checkbox" checked={showFormulaPreview} onChange={() => setShowFormulaPreview(!showFormulaPreview)} /> Show formulas in table</label>
      </div>

      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleCalculate}>Calculate</button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 overflow-x-auto">
          {mode !== "fixed" && <p><strong>Derivative f'(x):</strong> {result.derivative}</p>}
          {mode === "fixed" && <p><strong>Used g(x):</strong> {result.gFunc}</p>}

          <table className="border-collapse border border-gray-500 mt-4 w-full text-sm">
            <thead>
              <tr>
                <th className="border p-1">Iteration</th>
                {mode === "fixed" ? <>
                  <th className="border p-1">pᵢ</th>
                  <th className="border p-1">g(pᵢ)</th>
                  <th className="border p-1">|pᵢ₊₁ - pᵢ|</th>
                </> : <>
                  <th className="border p-1">a</th>
                  <th className="border p-1">b</th>
                  <th className="border p-1">c</th>
                  <th className="border p-1">{mode === "root" ? "f(c)" : "h(c)"}</th>
                  {mode === "optimal" && <>
                    <th className="border p-1">h(a)</th>
                    <th className="border p-1">h(b)</th>
                    <th className="border p-1">|b-a|</th>
                  </>}
                </>}
                {showTolCheck && <th className="border p-1">Within Tol?</th>}
              </tr>
            </thead>
            <tbody>
              {result.iterations.map((it) => (
                <tr key={it.iter}>
                  <td className="border p-1">{it.iter}</td>
                  {mode === "fixed" ? <>
                    <td className="border p-1">{showFormulaPreview ? it.pi.formula : formatValue(it.pi.value)}</td>
                    <td className="border p-1">{showFormulaPreview ? it.gpi.formula : formatValue(it.gpi.value)}</td>
                    <td className="border p-1">{showFormulaPreview ? it.diff.formula : formatValue(it.diff.value)}</td>
                  </> : <>
                    <td className="border p-1">{showFormulaPreview ? it.a.formula : formatValue(it.a.value)}</td>
                    <td className="border p-1">{showFormulaPreview ? it.b.formula : formatValue(it.b.value)}</td>
                    <td className="border p-1">{showFormulaPreview ? it.c.formula : formatValue(it.c.value)}</td>
                    <td className="border p-1">{showFormulaPreview ? it.fc.formula : formatValue(it.fc.value)}</td>
                    {mode === "optimal" && <>
                      <td className="border p-1">{showFormulaPreview ? it.fa.formula : formatValue(it.fa.value)}</td>
                      <td className="border p-1">{showFormulaPreview ? it.fb.formula : formatValue(it.fb.value)}</td>
                      <td className="border p-1">{showFormulaPreview ? it.diff.formula : formatValue(it.diff.value)}</td>
                    </>}
                  </>}
                  {showTolCheck && <td className="border p-1">{it.withinTol ? "TRUE" : "FALSE"}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          <button className="bg-green-500 text-white p-2 rounded mt-4"
            onClick={() => exportToExcel(result.iterations, result.derivative, formulaOnly, parseFloat(tolerance), mode)}>
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
}
