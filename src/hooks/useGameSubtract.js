import {useState, useEffect} from "react";

export function useGameSubtract() {
    const [problem, setProblem] = useState({ term1: 0, term2: 0, symbol: "-" });
    
    useEffect(() => {
        generateNewProblem();
    }, []);

    function generateNewProblem() {
        let term1 = Math.floor(Math.random() * 100);
        let term2 = Math.floor(Math.random() * 100);
        if (term2 > term1) [term1, term2] = [term2, term1]; // Ensure no negative results
        const solution = term1 - term2;
        setProblem({ term1, term2, symbol: "-", solution });
    }

    return { problem, generateNewProblem };
}