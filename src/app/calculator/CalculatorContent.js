"use client";

import { useState } from "react";
import { evaluate } from "mathjs";
import {
  runRootFinding,
  runOptimization,
  runFixedPoint,
  runGSS,
  getDerivative
} from "../../../lib/mathUtils";
import { exportToExcel } from "../../../lib/excelUtils";
import FunctionPlot from "./FunctionPlot";

export default function CalculatorContent() {
  const [func, setFunc] = useState("8*e^(1-x) + 7*log(x)");
  const [a, setA] = useState("1");
  const [b, setB] = useState("2");
  const [tolerance, setTolerance] = useState("0.0001");
  const [mode, setMode] = useState("root");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    try {
      setError("");
      const derivativeVal = getDerivative(func);
      let output;

      const start = parseFloat(a);
      const end = parseFloat(b);
      const tol = parseFloat(tolerance);

      if (mode === "root") {
        const fa = evaluate(func, { x: start });
        const fb = evaluate(func, { x: end });
        output =
          fa * fb > 0
            ? runOptimization(func, start, end, tol)
            : runRootFinding(func, start, end, tol);
      } else if (mode === "optimal") {
        output = runOptimization(func, start, end, tol);
      } else if (mode === "gss") {
        output = runGSS(func, start, end, tol);
      } else {
        output = runFixedPoint(func, start, tol);
      }

      setResult({ ...output, derivative: derivativeVal });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  // Helper class for consistent input styling
  const inputClass = "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d40] focus:border-transparent outline-none transition text-gray-800";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      
      <h1 className="text-3xl font-extrabold mb-8 text-[#004d40] border-b pb-4">
        Numerical Methods Calculator
      </h1>

      <div className="space-y-6">
        {/* Calculation Type */}
        <div>
          <label className={labelClass}>Calculation Type</label>
          <select
            className={inputClass}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="root">Root Finding (Bisection)</option>
            <option value="optimal">Optimization (Bisection)</option>
            <option value="gss">Optimization (Golden Section Search)</option>
            <option value="fixed">Fixed Point Iteration g(x)</option>
          </select>
        </div>

        {/* Function Input */}
        <div>
          <label className={labelClass}>Function f(x)</label>
          <input
            className={inputClass}
            value={func}
            onChange={(e) => setFunc(e.target.value)}
            placeholder="e.g., x^2 - 4"
          />
        </div>

        {/* Interval Inputs (Grid Layout) */}
        {mode !== "fixed" && (
          <div>
            <label className={labelClass}>Interval [a, b]</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                className={inputClass}
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="Start (a)"
              />
              <input
                className={inputClass}
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="End (b)"
              />
            </div>
          </div>
        )}

        {/* Tolerance */}
        <div>
          <label className={labelClass}>Tolerance</label>
          <input
            className={inputClass}
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            placeholder="e.g., 0.0001"
          />
        </div>

        {/* Calculate Button */}
        <button
          className="w-full bg-[#004d40] text-white font-bold text-lg py-4 rounded-lg shadow-md hover:bg-[#00382e] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          onClick={handleCalculate}
        >
          Calculate Solution
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="mt-10 border-t pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Results</h2>

          {mode !== "fixed" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 text-blue-900">
              <strong>Derivative f'(x):</strong> <span className="font-mono">{result.derivative}</span>
            </div>
          )}

          {/* Iteration Table */}
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mb-6">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-white uppercase bg-[#004d40]">
                <tr>
                  <th className="px-6 py-3">Iter</th>
                  {mode === "fixed" ? (
                    <>
                      <th className="px-6 py-3">pᵢ</th>
                      <th className="px-6 py-3">g(pᵢ)</th>
                      <th className="px-6 py-3">|pᵢ₊₁ - pᵢ|</th>
                      <th className="px-6 py-3">Within Tol</th>
                    </>
                  ) : mode === "gss" ? (
                    <>
                      <th className="px-6 py-3">a</th>
                      <th className="px-6 py-3">b</th>
                      <th className="px-6 py-3">a'</th>
                      <th className="px-6 py-3">b'</th>
                      <th className="px-6 py-3">f(a')</th>
                      <th className="px-6 py-3">f(b')</th>
                      <th className="px-6 py-3">Within Tol</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3">a</th>
                      <th className="px-6 py-3">b</th>
                      <th className="px-6 py-3">c</th>
                      <th className="px-6 py-3">f(c)</th>
                      <th className="px-6 py-3">|b-a|</th>
                      <th className="px-6 py-3">Within Tol</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {result.iterations.slice(0, 20).map((it, index) => (
                  <tr 
                    key={it.iter} 
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{it.iter}</td>
                    {mode === "fixed" ? (
                      <>
                        <td className="px-6 py-4">{it.pi.value}</td>
                        <td className="px-6 py-4">{it.gpi.value}</td>
                        <td className="px-6 py-4">{it.diff.value}</td>
                        <td className="px-6 py-4">
                          {it.withinTol ? <span className="text-green-600 font-bold">YES</span> : "NO"}
                        </td>
                      </>
                    ) : mode === "gss" ? (
                      <>
                        <td className="px-6 py-4">{it.a.value}</td>
                        <td className="px-6 py-4">{it.b.value}</td>
                        <td className="px-6 py-4">{it.a1.value}</td>
                        <td className="px-6 py-4">{it.b1.value}</td>
                        <td className="px-6 py-4">{it.fa1.value}</td>
                        <td className="px-6 py-4">{it.fb1.value}</td>
                        <td className="px-6 py-4">
                           {it.withinTol ? <span className="text-green-600 font-bold">YES</span> : "NO"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">{it.a.value}</td>
                        <td className="px-6 py-4">{it.b.value}</td>
                        <td className="px-6 py-4">{it.c.value}</td>
                        <td className="px-6 py-4">{it.fc.value}</td>
                        <td className="px-6 py-4">{it.diff?.value ?? Math.abs(it.b.value - it.a.value)}</td>
                        <td className="px-6 py-4">
                           {it.withinTol ? <span className="text-green-600 font-bold">YES</span> : "NO"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
             {result.iterations.length > 20 && (
                <p className="text-gray-500 italic text-sm">
                  Showing first 20 iterations only
                </p>
              )}
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow transition font-semibold"
              onClick={() => exportToExcel(mode, result.iterations)}
            >
              📥 Export to Excel
            </button>
          </div>

          {/* ---------- Function Plot Section ---------- */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold text-[#004d40] mb-4">Function Visualization</h2>
            <FunctionPlot
              func={func}
              a={parseFloat(a)}
              b={parseFloat(b)}
              highlightX={result.root?.value ?? null}
              iterations={result.iterations}
            />
          </div>
        </div>
      )}
    </div>
  );
}