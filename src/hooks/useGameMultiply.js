import {useState, useEffect} from "react";

export function useGameMultiply() {
    const [problem, setProblem] = useState({ term1: 0, term2: 0, symbol: "×" });
    
    useEffect(() => {
        generateNewProblem();
    }, []);

    function generateNewProblem() {
        const term1 = Math.floor(Math.random() * 10); // Keep numbers smaller for multiplication
        const term2 = Math.floor(Math.random() * 10);
        const solution = term1 * term2;
        setProblem({ term1, term2, symbol: "×", solution });
    }

    return { problem, generateNewProblem };
}
