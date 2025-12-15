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
  // Set default mode to Optimization (Bisection)
  const [mode, setMode] = useState("optimal"); 
  const [a, setA] = useState("1");
  const [b, setB] = useState("2");
  const [tolerance, setTolerance] = useState("0.0001");
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

  // Function to get the method name for the conclusion
  const getMethodName = (m) => {
    switch (m) {
      case "root": return "Root Finding (Bisection Method)";
      case "optimal": return "Optimization (Bisection Method)";
      case "gss": return "Optimization (Golden Section Search)";
      case "fixed": return "Fixed Point Iteration";
      default: return "Calculation";
    }
  };

  // Function to determine the final result label
  const getResultLabel = (m) => {
    if (m === "root") return "Approximate Root (x)";
    if (m === "optimal" || m === "gss") return "Minimizer (x)"; 
    return "Converged Fixed Point (p)";
  };

  // Logic to determine the final calculated value (DEFINITIVE FIX)
  const getFinalValue = () => {
      if (!result || !result.iterations || result.iterations.length === 0) return null;
      
      // Fixed point value
      if (mode === 'fixed') {
          return result.root?.value;
      }
      
      const lastIteration = result.iterations.slice(-1)[0];
      
      // 1. Check result.root value (highest priority if set correctly)
      if (result.root?.value !== undefined && result.root.value !== null) {
          return result.root.value;
      } 
      
      // 2. Check for the midpoint 'c' from the last iteration (Bisection/Root Finding)
      if (lastIteration.c?.value !== undefined && lastIteration.c.value !== null) {
          return lastIteration.c.value;
      }
      
      // 3. FALLBACK: Use the average of the final interval [a, b] for optimization methods
      // This is the theoretical final approximation.
      const finalA = lastIteration.a?.value ?? 0;
      const finalB = lastIteration.b?.value ?? 0;
      return (finalA + finalB) / 2;
  }
  
  // Logic to determine the function value at the minimizer 
  const getMinimizerYValue = () => {
    const x = getFinalValue();
    if (x !== null) {
        try {
            return evaluate(func, { x });
        } catch {}
    }
    return null;
  }
  
  // Logic to determine the final iteration count
  const getFinalIterationCount = () => {
      if (!result || !result.iterations) return 0;
      // The final iteration count is the 'iter' property of the last item in the array
      return result.iterations.length > 0 ? result.iterations.slice(-1)[0].iter : 0;
  }

  // Determine the values for display
  const highlightValue = getFinalValue();
  const minimizerYValue = getMinimizerYValue();
  const finalIterationCount = getFinalIterationCount();
  
  // Define a stable decimal precision for the final summary display (e.g., 4 decimal places)
  // This bypasses issues if result.decimalPlaces is missing or wrong.
  const displayPrecision = 4;


  return (
    // The w-full class here ensures this component fills the space given by the parent
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full">
      
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
            <option value="optimal">Optimization (Bisection)</option>
            <option value="root">Root Finding (Bisection)</option>
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
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Results and Iterations</h2>

          {mode !== "fixed" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 text-blue-900">
              <strong>Derivative f'(x):</strong> <span className="font-mono">{result.derivative}</span>
            </div>
          )}

          {/* Iteration Table */}
          <div className="rounded-lg shadow border border-gray-200 mb-6"> 
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-white uppercase bg-[#004d40]">
                <tr>
                  <th className="px-4 py-3 min-w-[50px]">Iter</th>
                  {mode === "fixed" ? (
                    <>
                      <th className="px-6 py-3 min-w-[150px]">pᵢ</th>
                      <th className="px-6 py-3 min-w-[150px]">g(pᵢ)</th>
                      <th className="px-6 py-3 min-w-[180px]">|pᵢ₊₁ - pᵢ|</th>
                      <th className="px-6 py-3 min-w-[100px]">Within Tol</th>
                    </>
                  ) : mode === "gss" ? (
                    <>
                      <th className="px-4 py-3 min-w-[100px]">a</th>
                      <th className="px-4 py-3 min-w-[100px]">b</th>
                      <th className="px-4 py-3 min-w-[100px]">a'</th>
                      <th className="px-4 py-3 min-w-[100px]">b'</th>
                      <th className="px-4 py-3 min-w-[150px]">f(a')</th>
                      <th className="px-4 py-3 min-w-[150px]">f(b')</th>
                      <th className="px-4 py-3 min-w-[100px]">Within Tol</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 min-w-[100px]">a</th>
                      <th className="px-4 py-3 min-w-[100px]">b</th>
                      <th className="px-4 py-3 min-w-[100px]">c</th>
                      <th className="px-4 py-3 min-w-[150px]">f(c)</th>
                      <th className="px-4 py-3 min-w-[150px]">|b-a|</th>
                      <th className="px-4 py-3 min-w-[100px]">Within Tol</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Iterations mapping */}
                 {result.iterations.map((it, index) => (
                  <tr 
                    key={it.iter} 
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{it.iter}</td>
                    {mode === "fixed" ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{it.pi.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{it.gpi.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{it.diff.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {it.withinTol ? <span className="text-green-600 font-bold">YES</span> : "NO"}
                        </td>
                      </>
                    ) : mode === "gss" ? (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap">{it.a.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.b.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.a1.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.b1.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.fa1.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.fb1.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                           {it.withinTol ? <span className="text-green-600 font-bold">YES</span> : "NO"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap">{it.a.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.b.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.c.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.fc.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{it.diff?.value ?? Math.abs(it.b.value - it.a.value)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
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
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-[#004d40] mb-4">Function Visualization</h2>
            <FunctionPlot
              func={func}
              a={parseFloat(a)}
              b={parseFloat(b)}
              highlightX={highlightValue}
              mode={mode} // Pass mode for correct labeling (Minimizer)
              iterations={result.iterations}
            />
          </div>

          {/* ---------- Final Answer and Conclusion ---------- */}
          <div className="p-6 bg-white border border-gray-300 rounded-xl shadow-md space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Calculation Summary</h3>

            {/* Given Parameters */}
            <div className="grid grid-cols-2 text-left">
                <p className="text-gray-600 font-medium">Function Used:</p>
                <p className="font-mono text-gray-900">{func}</p>
                <p className="text-gray-600 font-medium">Method:</p>
                <p className="font-semibold text-gray-900">{getMethodName(mode)}</p>
                {mode !== "fixed" && (
                    <>
                        <p className="text-gray-600 font-medium">Initial Interval [a, b]:</p>
                        <p className="font-semibold text-gray-900">[{a}, {b}]</p>
                    </>
                )}
                <p className="text-gray-600 font-medium">Tolerance:</p>
                <p className="font-semibold text-gray-900">{tolerance}</p>
            </div>
            
            <hr className="my-4"/>

            {/* Final Answer */}
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                <h4 className="text-xl font-bold text-green-800 mb-2">{getResultLabel(mode)}:</h4>
                <p className="text-3xl font-extrabold text-[#004d40] flex justify-between items-center">
                    {/* Use the defined precision to ensure 1.6094 is displayed */}
                    <span>{highlightValue ? highlightValue.toFixed(displayPrecision) : 'N/A'}</span>
      
                </p>
                <p className="text-sm text-green-700 mt-1">
                    Found after {finalIterationCount} iterations.
                </p>
            </div>

            {/* Conclusion */}
            <div className="pt-4">
                <p className="text-gray-700 italic">
                    <span className="font-bold text-green-800">Conclusion: </span> 
                    Using the {getMethodName(mode)} with a tolerance of {tolerance} and the initial interval [{a}, {b}], the algorithm converged in {finalIterationCount} iterations. The resulting {getResultLabel(mode).toLowerCase()} is approximately {highlightValue ? highlightValue.toFixed(displayPrecision) : 'N/A'}.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}