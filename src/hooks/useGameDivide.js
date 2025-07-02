import { useState, useEffect } from "react";

export function useGameDivide(config = { type: "easy" }) {
    const [problem, setProblem] = useState({ term1: 0, term2: 0, symbol: "÷" });

    useEffect(() => {
        generateNewProblem();
    }, [config.type]);

    function generateNewProblem() {
        let term1, term2, solution;

        if (config.type === "easy") {
            // Easy: Perfect divisions only (8÷2=4)
            term2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
            const multiplier = Math.floor(Math.random() * 10) + 1; // 1 to 10
            term1 = term2 * multiplier;
            solution = term1 / term2;
        } 
        else if (config.type === "medium") {
            // Medium: Perfect divisions with larger numbers (72÷8=9)
            term2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
            const multiplier = Math.floor(Math.random() * 15) + 1; // 1 to 15
            term1 = term2 * multiplier;
            solution = term1 / term2;
        } 
        else if (config.type === "hard") {
            // Hard: Simple decimals with .5 endings (7÷2=3.5, 9÷2=4.5)
            const useDecimal = Math.random() < 0.5; // 50% chance for decimal
            
            if (useDecimal) {
                term2 = 2; // Always divide by 2 for .5 results
                const baseNumber = Math.floor(Math.random() * 10) + 1; // 1 to 10
                term1 = baseNumber * 2 + 1; // Make it odd for .5 result
                solution = term1 / term2;
            } else {
                // Regular perfect division
                term2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
                const multiplier = Math.floor(Math.random() * 12) + 1; // 1 to 12
                term1 = term2 * multiplier;
                solution = term1 / term2;
            }
        }

        setProblem({ term1, term2, symbol: "÷", solution });
    }

    return { problem, generateNewProblem };
}