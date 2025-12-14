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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Numerical Methods Calculator</h1>

      <label className="font-semibold">Calculation Type:</label>
      <select
        className="border p-2 w-full mb-2"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="root">Root Finding (Bisection)</option>
        <option value="optimal">Optimization (Interval Halving)</option>
        <option value="gss">Optimization (Golden Section Search)</option>
        <option value="fixed">Fixed Point Iteration g(x)</option>
      </select>

      <label className="font-semibold">Function f(x):</label>
      <input
        className="border p-2 w-full mb-2"
        value={func}
        onChange={(e) => setFunc(e.target.value)}
      />

      {mode !== "fixed" && (
        <div className="mb-2">
          <label className="font-semibold block mb-1">Interval:</label>
          <div className="flex gap-2">
            <input
              className="border p-2 w-full"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="a"
            />
            <input
              className="border p-2 w-full"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="b"
            />
          </div>
        </div>
      )}

      <label className="font-semibold">Tolerance:</label>
      <input
        className="border p-2 w-full mb-2"
        value={tolerance}
        onChange={(e) => setTolerance(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white p-2 rounded mb-4"
        onClick={handleCalculate}
      >
        Calculate
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 overflow-x-auto">
          {mode !== "fixed" && (
            <p>
              <strong>Derivative f'(x):</strong> {result.derivative}
            </p>
          )}

          {/* Iteration Table */}
          <table className="border-collapse border border-gray-500 mt-4 w-full text-sm">
            <thead>
              <tr>
                <th className="border p-1">Iter</th>
                {mode === "fixed" ? (
                  <>
                    <th className="border p-1">pᵢ</th>
                    <th className="border p-1">g(pᵢ)</th>
                    <th className="border p-1">|pᵢ₊₁ - pᵢ|</th>
                    <th className="border p-1">Within Tol</th>
                  </>
                ) : mode === "gss" ? (
                  <>
                    <th className="border p-1">a</th>
                    <th className="border p-1">b</th>
                    <th className="border p-1">a'</th>
                    <th className="border p-1">b'</th>
                    <th className="border p-1">f(a')</th>
                    <th className="border p-1">f(b')</th>
                    <th className="border p-1">Within Tol</th>
                  </>
                ) : (
                  <>
                    <th className="border p-1">a</th>
                    <th className="border p-1">b</th>
                    <th className="border p-1">c</th>
                    <th className="border p-1">f(c)</th>
                    <th className="border p-1">|b-a|</th>
                    <th className="border p-1">Within Tol</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {result.iterations.slice(0, 20).map((it) => (
                <tr key={it.iter}>
                  <td className="border p-1">{it.iter}</td>
                  {mode === "fixed" ? (
                    <>
                      <td className="border p-1">{it.pi.value}</td>
                      <td className="border p-1">{it.gpi.value}</td>
                      <td className="border p-1">{it.diff.value}</td>
                      <td className="border p-1">{it.withinTol ? "TRUE" : "FALSE"}</td>
                    </>
                  ) : mode === "gss" ? (
                    <>
                      <td className="border p-1">{it.a.value}</td>
                      <td className="border p-1">{it.b.value}</td>
                      <td className="border p-1">{it.a1.value}</td>
                      <td className="border p-1">{it.b1.value}</td>
                      <td className="border p-1">{it.fa1.value}</td>
                      <td className="border p-1">{it.fb1.value}</td>
                      <td className="border p-1">{it.withinTol ? "TRUE" : "FALSE"}</td>
                    </>
                  ) : (
                    <>
                      <td className="border p-1">{it.a.value}</td>
                      <td className="border p-1">{it.b.value}</td>
                      <td className="border p-1">{it.c.value}</td>
                      <td className="border p-1">{it.fc.value}</td>
                      <td className="border p-1">{it.diff?.value ?? Math.abs(it.b.value - it.a.value)}</td>
                      <td className="border p-1">{it.withinTol ? "TRUE" : "FALSE"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="bg-green-500 text-white p-2 rounded mt-4"
            onClick={() => exportToExcel(mode, result.iterations)}
          >
            Export to Excel
          </button>

          {result.iterations.length > 20 && (
            <p className="text-gray-600 mt-2">Only showing first 20 iterations</p>
          )}

          {/* ---------- Function Plot Section ---------- */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Function Plot</h2>
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
