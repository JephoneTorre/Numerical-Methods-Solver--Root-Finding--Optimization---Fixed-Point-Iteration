import { derivative, evaluate } from "mathjs";

// Helper to store both value and formula
function valueWithFormula(value, formula) {
  return { value, formula };
}

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

    iterations.push({
      iter,
      a: valueWithFormula(a, `a_${iter}=${a}`),
      b: valueWithFormula(b, `b_${iter}=${b}`),
      c: valueWithFormula(c, `c_${iter}=(a+b)/2`),
      fc: valueWithFormula(fc, `f(c_${iter})`),
      withinTol
    });

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
export function runOptimization(func, aInit, bInit, tol, maxIter = 100) {
  const iterations = [];
  let a = aInit;
  let b = bInit;
  let iter = 0;

  while (iter < maxIter) {
    const c = (a + b) / 2;
    const fa = evaluate(func, { x: a });
    const fb = evaluate(func, { x: b });
    const fc = evaluate(func, { x: c });
    const diff = Math.abs(b - a);
    const withinTol = diff < tol;

    iterations.push({
      iter,
      a: valueWithFormula(a, `a_${iter}=${a}`),
      b: valueWithFormula(b, `b_${iter}=${b}`),
      c: valueWithFormula(c, `c_${iter}=(a+b)/2`),
      fc: valueWithFormula(fc, `f(c_${iter})`),
      fa: valueWithFormula(fa, `f(a_${iter})`),
      fb: valueWithFormula(fb, `f(b_${iter})`),
      diff: valueWithFormula(diff, `|b_${iter}-a_${iter}|`),
      withinTol
    });

    if (withinTol) break;

    // Interval halving logic: move the side with higher value
    if (fa < fb) {
      b = c;
    } else {
      a = c;
    }

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
    const pNextVal = evaluate(gFunc, { x: p });
    const diffVal = Math.abs(pNextVal - p);
    const withinTol = diffVal < tol;

    iterations.push({
      iter,
      pi: valueWithFormula(p, `p_${iter}=${p}`),
      gpi: valueWithFormula(pNextVal, `g(p_${iter})=${gFunc.replace("x", p)}`),
      diff: valueWithFormula(diffVal, `|p_${iter+1}-p_${iter}|`),
      gFunc,
      withinTol
    });

    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;

    p = pNextVal;
    iter++;
  }

  return { root: p, iterations, gFunc };
}
