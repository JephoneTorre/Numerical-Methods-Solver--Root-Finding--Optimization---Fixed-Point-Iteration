"use client";

import { useState } from "react";
import { evaluate } from "mathjs";
import { runRootFinding, runOptimization, runFixedPoint, getDerivative } from "../../lib/mathUtils";
import { exportToExcel } from "../../lib/excelUtils";

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
  const [activeTab, setActiveTab] = useState("home"); // home, calculator, about

  const handleCalculate = () => {
    try {
      setError("");
      const derivativeVal = getDerivative(func);
      let output;

      if (mode === "root") {
        const start = parseFloat(a);
        const end = parseFloat(b);
        const fa = evaluate(func, { x: start });
        const fb = evaluate(func, { x: end });
        if (fa * fb > 0) output = runOptimization(func, start, end, parseFloat(tolerance));
        else output = runRootFinding(func, start, end, parseFloat(tolerance));
      } else if (mode === "optimal") {
        output = runOptimization(func, parseFloat(a), parseFloat(b), parseFloat(tolerance));
      } else {
        output = runFixedPoint(func, parseFloat(a), parseFloat(tolerance));
      }

      setResult({ ...output, derivative: derivativeVal });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Lufga, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-end space-x-2.5 shadow-md z-50">
        <button
          onClick={() => setActiveTab("home")}
          className={`font-semibold ${activeTab === "home" ? "text-yellow-400" : "hover:text-yellow-300"}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`font-semibold ${activeTab === "calculator" ? "text-yellow-400" : "hover:text-yellow-300"}`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`font-semibold ${activeTab === "about" ? "text-yellow-400" : "hover:text-yellow-300"}`}
        >
          About Us
        </button>
      </header>

      {/* Main content */}
      <div className="pt-28 max-w-6xl mx-auto p-4 text-green-900">
        {activeTab === "home" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Numerical Methods App</h1>
            <p>Click on the Calculator tab to start solving functions using Root-Finding, Optimization, or Fixed-Point Iteration.</p>
          </div>
        )}

        {activeTab === "about" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p>This app was built using Next.js, React, and Tailwind CSS. It helps you compute numerical solutions for functions and export results with formulas.</p>
          </div>
        )}

        {activeTab === "calculator" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Numerical Methods Calculator</h1>

            <label className="font-semibold">Calculation Type:</label>
            <select className="border p-2 w-full mb-2" value={mode} onChange={e => setMode(e.target.value)}>
              <option value="root">Root Finding (Bisection)</option>
              <option value="optimal">Optimization (Interval Halving)</option>
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

            <button className="bg-blue-500 text-white p-2 rounded mb-4" onClick={handleCalculate}>Calculate</button>

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
                          <td className="border p-1">{showFormulaPreview ? it.pi.formula : it.pi.value}</td>
                          <td className="border p-1">{showFormulaPreview ? it.gpi.formula : it.gpi.value}</td>
                          <td className="border p-1">{showFormulaPreview ? it.diff.formula : it.diff.value}</td>
                        </> : <>
                          <td className="border p-1">{showFormulaPreview ? it.a.formula : it.a.value}</td>
                          <td className="border p-1">{showFormulaPreview ? it.b.formula : it.b.value}</td>
                          <td className="border p-1">{showFormulaPreview ? it.c.formula : it.c.value}</td>
                          <td className="border p-1">{showFormulaPreview ? it.fc.formula : it.fc.value}</td>
                          {mode === "optimal" && <>
                            <td className="border p-1">{showFormulaPreview ? it.fa.formula : it.fa.value}</td>
                            <td className="border p-1">{showFormulaPreview ? it.fb.formula : it.fb.value}</td>
                            <td className="border p-1">{showFormulaPreview ? it.diff.formula : it.diff.value}</td>
                          </>}
                        </>}
                        {showTolCheck && <td className="border p-1">{it.withinTol ? "TRUE" : "FALSE"}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button className="bg-green-500 text-white p-2 rounded mt-4"
                  onClick={() => exportToExcel(mode, result.iterations)}>
                  Export to Excel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
