import { derivative, evaluate } from "mathjs";

// Correct derivative
export function getDerivative(func) {
  try {
    const der = derivative(func, "x");
    return der.toString();
  } catch {
    return "Invalid function";
  }
}

// Root-Finding (Bisection)
export function runRootFinding(func, a, b, tol, maxIter = 100) {
  const iterations = [];
  let fa = evaluate(func, { x: a });
  let fb = evaluate(func, { x: b });
  if (fa * fb > 0) throw new Error("f(a) and f(b) must have opposite signs");

  let iter = 0, c, fc;
  let extra = 0;
  while (iter < maxIter) {
    c = (a + b) / 2;
    fc = evaluate(func, { x: c });
    const withinTol = Math.abs(fc) < tol;
    iterations.push({ iter, a, b, c, fc, withinTol });
    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
    iter++;
  }
  return { root: c, iterations };
}

// Optimization (Interval Halving)
export function runOptimization(func, a, b, tol, maxIter = 100) {
  const iterations = [];
  let iter = 0;
  let extra = 0;

  while (iter < maxIter) {
    const c = (a + b) / 2;
    const fa = evaluate(func, { x: a });
    const fb = evaluate(func, { x: b });
    const fc = evaluate(func, { x: c });
    const withinTol = Math.abs(b - a) < tol;

    iterations.push({ iter, a, b, c, fc, fa, fb, withinTol });
    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;

    if (fa < fb) b = c;
    else a = c;

    iter++;
  }

  return { root: (a + b) / 2, iterations };
}

// Fixed-Point Iteration
export function runFixedPoint(fFunc, p0, tol, maxIter = 100) {
  const iterations = [];
  const lambda = 0.1;
  const gFunc = `x - ${lambda}*(${fFunc})`;
  let p = p0;
  let iter = 0;
  let extra = 0;

  while (iter < maxIter) {
    let pNext = evaluate(gFunc, { x: p });
    const diff = Math.abs(pNext - p);
    const withinTol = diff < tol;
    iterations.push({ iter, pi: p, gpi: pNext, diff, withinTol, gFunc });
    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;
    p = pNext;
    iter++;
  }

  return { root: p, iterations, gFunc };
}
