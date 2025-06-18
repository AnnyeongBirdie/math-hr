import { useState, useEffect } from "react";

export function useGameDivide() {
  const [problem, setProblem] = useState({ term1: 0, term2: 0, symbol: "÷" });

  useEffect(() => {
    generateNewProblem();
  }, []);

  function generateNewProblem() {
    const term2 = Math.floor(Math.random() * 9) + 1; // 1 to 9 (no zero)
    const multiplier = Math.floor(Math.random() * 10); // 0 to 9
    const term1 = term2 * multiplier; // term1 is divisible by term2
    const solution = term1 / term2;

    setProblem({ term1, term2, symbol: "÷", solution });
  }

  return { problem, generateNewProblem };
}

