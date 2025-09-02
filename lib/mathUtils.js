import { derivative, evaluate } from "mathjs";

// Helper to store value and formula
function valWithFormula(value, formula) {
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
      c: valWithFormula(c, `c${iter+1} = (a+b)/2`),
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

// Optimization (Interval Halving)
export function runOptimization(func, a, b, tol, maxIter = 100) {
  const iterations = [];
  let iter = 0;
  let extra = 0;

  while (iter < maxIter) {
    const c = (a + b) / 2;
    const faVal = evaluate(func, { x: a });
    const fbVal = evaluate(func, { x: b });
    const fcVal = evaluate(func, { x: c });

    const fa = valWithFormula(faVal, `f(${a})`);
    const fb = valWithFormula(fbVal, `f(${b})`);
    const fc = valWithFormula(fcVal, `f(${c})`);
    const withinTol = Math.abs(b - a) < tol;

    iterations.push({
      iter,
      a: valWithFormula(a, `a${iter+1}`),
      b: valWithFormula(b, `b${iter+1}`),
      c: valWithFormula(c, `(a+b)/2`),
      fa,
      fb,
      fc,
      diff: valWithFormula(Math.abs(b - a), `|b-a|`),
      withinTol
    });

    if (withinTol) extra++;
    if (withinTol && extra >= 5) break;

    if (faVal < fbVal) b = c;
    else a = c;

    iter++;
  }

  const rootVal = (a + b) / 2;
  return { root: valWithFormula(rootVal, `(a+b)/2`), iterations };
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
    let pNextVal = evaluate(gFunc, { x: p });
    const diffVal = Math.abs(pNextVal - p);
    const withinTol = diffVal < tol;

    iterations.push({
      iter,
      pi: valWithFormula(p, `p${iter}`),
      gpi: valWithFormula(pNextVal, `g(p${iter}) = ${gFunc}`),
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

// Golden Section Search (GSS) for optimization
export function runGSS(func, a, b, tol, maxIter = 100) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const iterations = [];
  let iter = 0;
  let extra = 0;

  let x1 = b - (b - a) / phi;
  let x2 = a + (b - a) / phi;
  let fx1 = evaluate(func, { x: x1 });
  let fx2 = evaluate(func, { x: x2 });

  while (iter < maxIter && Math.abs(b - a) > tol) {
    const withinTol = Math.abs(b - a) < tol;

    iterations.push({
      iter,
      a: valWithFormula(a, `a${iter+1}`),
      b: valWithFormula(b, `b${iter+1}`),
      x1: valWithFormula(x1, `x1`),
      x2: valWithFormula(x2, `x2`),
      fx1: valWithFormula(fx1, `f(x1)`),
      fx2: valWithFormula(fx2, `f(x2)`),
      withinTol
    });

    if (fx1 < fx2) {
      b = x2;
    } else {
      a = x1;
    }

    x1 = b - (b - a) / phi;
    x2 = a + (b - a) / phi;
    fx1 = evaluate(func, { x: x1 });
    fx2 = evaluate(func, { x: x2 });

    iter++;
  }

  const rootVal = (a + b) / 2;
  return { root: valWithFormula(rootVal, `(a+b)/2`), iterations };
}
