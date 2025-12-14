import { derivative, evaluate } from "mathjs";

// Helper to store value and formula
function valWithFormula(value, formula) {
  return { value, formula };
}

// Derivative
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
  let faVal = evaluate(func, { x: a });
  let fbVal = evaluate(func, { x: b });

  if (faVal * fbVal > 0) throw new Error("f(a) and f(b) must have opposite signs");

  let iter = 0, c, fc;
  let extra = 0;

  while (iter < maxIter) {
    c = (a + b) / 2;
    const fcVal = evaluate(func, { x: c });
    fc = valWithFormula(fcVal, `f(${c})`);
    const withinTol = Math.abs(fcVal) < tol;

    iterations.push({
      iter,
      a: valWithFormula(a, `a${iter+1}`),
      b: valWithFormula(b, `b${iter+1}`),
      c: valWithFormula(c, `(a+b)/2`),
      fc,
      withinTol
    });

    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;

    if (faVal * fcVal < 0) {
      b = c;
      fbVal = fcVal;
    } else {
      a = c;
      faVal = fcVal;
    }
    iter++;
  }

  return { root: valWithFormula(c, `root`), iterations };
}

// Interval Halving Optimization
export function runOptimization(func, a, b, tol, maxIter = 100) {
  const iterations = [];
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
      a: valWithFormula(a, `a${iter+1}`),
      b: valWithFormula(b, `b${iter+1}`),
      c: valWithFormula(c, `(a+b)/2`),
      fa: valWithFormula(fa, `f(a${iter+1})`),
      fb: valWithFormula(fb, `f(b${iter+1})`),
      fc: valWithFormula(fc, `f(c${iter+1})`),
      diff: valWithFormula(diff, `|b-a|`),
      withinTol
    });

    if (withinTol) break;

    if (fa < fb) {
      b = c;
    } else {
      a = c;
    }

    iter++;
  }

  return { root: valWithFormula((a + b)/2, `root`), iterations };
}

// Golden Section Search (Optimization)
export function runGSS(func, a, b, tol, maxIter = 100) {
  const iterations = [];
  const p = 0.381966;
  let iter = 0;

  while (iter < maxIter && Math.abs(b - a) > tol) {
    const a1 = a + p * (b - a);
    const b1 = a + (1 - p) * (b - a);

    const fa1 = evaluate(func, { x: a1 });
    const fb1 = evaluate(func, { x: b1 });

    const withinTol = Math.abs(b - a) < tol;

    iterations.push({
      iter,
      a: valWithFormula(a, `a${iter+1}`),
      b: valWithFormula(b, `b${iter+1}`),
      a1: valWithFormula(a1, `a'`),
      b1: valWithFormula(b1, `b'`),
      fa1: valWithFormula(fa1, `f(a')`),
      fb1: valWithFormula(fb1, `f(b')`),
      diff: valWithFormula(Math.abs(b - a), `|b-a|`),
      withinTol
    });

    if (fa1 < fb1) {
      b = b1;
    } else {
      a = a1;
    }

    iter++;
  }

  return { root: valWithFormula((a + b) / 2, `(a+b)/2`), iterations };
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
      pi: valWithFormula(p, `p${iter}`),
      gpi: valWithFormula(pNextVal, `g(p${iter})`),
      diff: valWithFormula(diffVal, `|p${iter+1}-p${iter}|`),
      withinTol,
      gFunc
    });

    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;

    p = pNextVal;
    iter++;
  }

  return { root: valWithFormula(p, `root`), iterations, gFunc };
}
