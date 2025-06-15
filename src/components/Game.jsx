import React, { useState } from "react";
import { useGameAdd } from "../hooks/useGameAdd";
import { useGameSubtract } from "../hooks/useGameSubtract";
import { useGameMultiply } from "../hooks/useGameMultiply";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Answer from "./Answer";
import Header from "./Header";
import addIcon from "../assets/images/addition_card.png";
import subtractIcon from "../assets/images/subtraction_card.png";
import multiplyIcon from "../assets/images/multiplication_card.png";
import divideIcon from "../assets/images/division_card.png";
import enterButton from "../assets/images/button_image_enter.png";
import newButton from "../assets/images/button_image_new_problem.png";
import resetButton from "../assets/images/button_image_reset_score.png";

function Game() {
    console.log("Game.jsx component is loaded");
    const [operation, setOperation] = useState("+");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [correct, setCorrect] = useState(parseInt(localStorage.getItem("correct")) || 0);
    const [wrong, setWrong] = useState(parseInt(localStorage.getItem("wrong")) || 0);

    
    const { problem: addProblem, generateNewProblem: newAddProblem } = useGameAdd();
    const { problem: subtractProblem, generateNewProblem: newSubtractProblem } = useGameSubtract();
    const { problem: multiplyProblem, generateNewProblem: newMultiplyProblem } = useGameMultiply();

    const problem = operation === "+" ? addProblem : operation === "-" ? subtractProblem : multiplyProblem;
    const generateNewProblem = operation === "+" ? newAddProblem : operation === "-" ? newSubtractProblem : newMultiplyProblem;
    

    const handleNumberClick = (number) => {
        setUserAnswer((prev) => (parseInt(prev || "0") * 10 + number).toString());
    }

    const handleSubmit = () => {

        const isCorrect = parseFloat(userAnswer) === problem.solution;

        setUserAnswer("");

        setTimeout(() => {
            if (isCorrect) {
                setCorrect(prev => {
                    const newCorrect = prev + 1;
                    localStorage.setItem("correct", newCorrect);
                    return newCorrect;
                });
                toast.success("잘했어요! 🎉", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            } else {
                setWrong(prev => {
                    const newWrong = prev + 1;
                    localStorage.setItem("wrong", newWrong);
                    return newWrong;
                });
                toast.error("아쉽지만 틀렸어요. 다시해봐요! 🥴", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
            setUserAnswer("");
        }, 500);
    };

    const handleNewProblem = () => {
        generateNewProblem();
        setFeedback(""); 
        setUserAnswer("");
    };

    const resetScore = () => {
        setFeedback("");
        setUserAnswer("");
        setCorrect(0);
        setWrong(0);
        localStorage.setItem("correct", 0);
        localStorage.setItem("wrong", 0);
    };

    const total = correct + wrong;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    


    return (
        <div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Header score={score} correct={correct} total={total} feedback={feedback} />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "10px 0" }}>
               <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
               <img
                    src={addIcon}
                    alt="Addition"
                    onClick={() => setOperation("+")}
                    style={{ 
                        cursor: "pointer", 
                        width: "50px", 
                        height: "75px",  
                        border: operation === "+" ? "2px solid blue" : "none",
                        borderRadius: "8px" 
                    }}
                />
                <img
                    src={subtractIcon}
                    alt="Subtraction"
                    onClick={() => setOperation("-")}
                    style={{ 
                        ursor: "pointer", 
                        width: "50px", 
                        height: "75px", 
                        border: operation === "-" ? "2px solid blue" : "none",
                        borderRadius: "8px" 
                    }}
                />
                <img
                    src={multiplyIcon}
                    alt="Multiplication"
                    onClick={() => setOperation("×")}
                    style={{ 
                        cursor: "pointer", 
                        width: "50px", 
                        height: "75px",
                        border: operation === "×" ? "2px solid blue" : "none",
                        borderRadius: "8px"  
                    }}
                />
                
                <img
                    src={divideIcon}
                    alt="Division"
                    onClick={() => setOperation("÷")}
                    style={{ 
                        cursor: "pointer", 
                        width: "50px", 
                        height: "75px",
                        border: operation === "÷" ? "2px solid blue" : "none",
                        borderRadius: "8px"  
                    }}
                />
               </div>
                
            </div>

            <div 
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                fontSize: '50px',
                color: '#89CFF0'
                }}>
                <p>{problem.term1} {problem.symbol} {problem.term2} = {userAnswer || "?"}</p>
            </div>

            <Answer onNumberClick={handleNumberClick} />
    

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "10px 0" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "20px", gap: "10px" }}>
                    <img
                        src={enterButton}
                        alt="Enter"
                        onClick={handleSubmit}
                        style={{ 
                            cursor: "pointer", 
                            width: "85px", 
                            height: "50px" 
                        }}
                    />

                    <img 
                        src={newButton}
                        alt="New Problem"
                        onClick={handleNewProblem}
                        style={{ 
                            cursor: "pointer", 
                            width: "85px", 
                            height: "50px" 
                        }}
                    />
                    
                    <img
                        src={resetButton}
                        alt="Reset Score"
                        onClick={resetScore}
                        style={{ 
                            cursor: "pointer", 
                            width: "85px", 
                            height: "50px" 
                        }}
                    />
                </div>
               
            </div>
       
        <ToastContainer />
           
        </div>
    );
}

export default Game;
