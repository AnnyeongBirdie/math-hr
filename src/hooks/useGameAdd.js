import {useState, useEffect} from "react";

export function useGameAdd() {
    const [problem, setProblem] = useState({ term1: 0, term2: 0, symbol: "+" });
    
    useEffect(() => {
        generateNewProblem();
    }, []);

    function generateNewProblem() {
        const term1 = Math.floor(Math.random() * 100);
        const term2 = Math.floor(Math.random() * 100);
        const solution = term1 + term2;
        setProblem({ term1, term2, symbol: "+", solution });
    }

    return { problem, generateNewProblem };
}

