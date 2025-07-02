import {useState, useEffect} from "react";

export function useGameSubtract(range = { min: 1, max: 100 }) {
    const [problem, setProblem] = useState({ term1: 0, term2: 0, symbol: "-" });
    
    useEffect(() => {
        generateNewProblem();
    }, [range.min, range.max]);

    function generateNewProblem() {
        let term1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let term2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        if (term2 > term1) [term1, term2] = [term2, term1]; // Ensure no negative results
        const solution = term1 - term2;
        setProblem({ term1, term2, symbol: "-", solution });
    }

    return { problem, generateNewProblem };
}