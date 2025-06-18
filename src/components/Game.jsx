import React, { useState } from "react";
import { useGameAdd } from "../hooks/useGameAdd";
import { useGameSubtract } from "../hooks/useGameSubtract";
import { useGameMultiply } from "../hooks/useGameMultiply";
import { useGameDivide } from "../hooks/useGameDivide";
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
import deleteButton from "../assets/images/button_image_delete.png";
import clickSound from "../assets/sounds/mouse-click-153941.mp3";
import successSound from "../assets/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
import errorSound from "../assets/sounds/error-11-352286.mp3";
import newSound from "../assets/sounds/new-notification-09-352705.mp3";
import resetSound from "../assets/sounds/harp-flourish-6251.mp3";
import switchSound from "../assets/sounds/noisy-switch-166327.mp3";


function Game() {
    console.log("Game.jsx component is loaded");
    const [operation, setOperation] = useState("+");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [correct, setCorrect] = useState(parseInt(localStorage.getItem("correct")) || 0);
    const [wrong, setWrong] = useState(parseInt(localStorage.getItem("wrong")) || 0);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const clickAudio = new Audio(clickSound);
    const successAudio = new Audio(successSound);
    const errorAudio = new Audio(errorSound);
    const newAudio = new Audio(newSound);
    const resetAudio = new Audio(resetSound);
    const switchAudio = new Audio(switchSound);
    const playSound = (audio) => {
        audio.currentTime = 0;
        audio.play();
    }


    
    const { problem: addProblem, generateNewProblem: newAddProblem } = useGameAdd();
    const { problem: subtractProblem, generateNewProblem: newSubtractProblem } = useGameSubtract();
    const { problem: multiplyProblem, generateNewProblem: newMultiplyProblem } = useGameMultiply();
    const { problem: divideProblem, generateNewProblem: newDivideProblem } = useGameDivide();

    const problem = operation === "+" ? addProblem : operation === "-" ? subtractProblem : operation === "×" ? multiplyProblem : divideProblem ;
    const generateNewProblem = operation === "+" ? newAddProblem : operation === "-" ? newSubtractProblem : operation === "×" ? newMultiplyProblem : newDivideProblem ;
    
    /* Task: Add new feature - Division  */
    // 1. Create separate hook useGameDivide.js for lower elementary students (must be divisible without remainders, no decimals)
    // 2. Edit consts problem and generateNewProblem to dynamically respond when operation === "×"
    // 3. Edit consts problem and generateNewProblem to dynamically respond when operation === "÷" 

    /* Task: Fix bugs */
    // 4. a new problem should be generate when answer is submitted for substract and multiply problems (currently only works for add problems)
    // 5. Fix toastify set timeout issue - new problem should follow toast only when the answer is correct
    // 6. Create logic so that there is an option to edit answer before submitting
    // 7. Add sound effects

    const handleNumberClick = (number) => {
        playSound(clickAudio);
        setUserAnswer((prev) => (parseInt(prev || "0") * 10 + number).toString());
    }

    const handleDelete = () => {
        /* write code to delete answer. */
        playSound(clickAudio);
        setUserAnswer((prev) => prev.slice(0,-1));
    }


    const handleSubmit = () => {

        if (hasSubmitted) return; // prevent multiple submission

        setHasSubmitted(true); // temporarily block future submission

        const isCorrect = parseFloat(userAnswer) === problem.solution;
        setUserAnswer(""); //clear input for now

        setUserAnswer("");

        setTimeout(() => {
            if (isCorrect) {
                playSound(successAudio);
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
                setTimeout(() => {
                    generateNewProblem();
                    setUserAnswer("");
                    setHasSubmitted(false); // allow new submission
                }, 1500);
                
            } else {
                playSound(errorAudio);
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
                
                setTimeout(() => {
                    setHasSubmitted(false);
                }, 1000); // re-enable submit after short delay to allow retry
            }
        }, 500);
    };

    const handleNewProblem = () => {
        playSound(newAudio);
        generateNewProblem();
        setFeedback(""); 
        setUserAnswer("");
        setHasSubmitted(false);
    };

    const resetScore = () => {
        playSound(resetAudio);
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
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', fontFamily: 'arial'}}>
                <Header score={score} correct={correct} total={total} feedback={feedback} />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px 0", backgroundColor: '#FFFFFF', fontFamily: 'arial' }}>
               <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
               <img
                    src={addIcon}
                    alt="Addition"
                    onClick={() => {
                        playSound(switchAudio);
                        setOperation("+"); 
                        setHasSubmitted(false);
                    }}
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
                    onClick={() => {
                        playSound(switchAudio);
                        setOperation("-");
                        setHasSubmitted(false);
                    }}
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
                    onClick={() => {
                        playSound(switchAudio);
                        setOperation("×"); 
                        setHasSubmitted(false);
                    }}
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
                    onClick={() => {
                        playSound(switchAudio);
                        setOperation("÷"); 
                        setHasSubmitted(false);
                    }}
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
                fontWeight: 'bold',
                color: '#636363',
                backgroundColor: '#FFFFFF',
                fontFamily: 'arial'
                }}>
                <p>{problem.term1} {problem.symbol} {problem.term2} = {userAnswer || "?"}</p>
            </div>

            <Answer onNumberClick={handleNumberClick} />
    

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px 0", backgroundColor: '#FFFFFF', fontFamily: 'arial' }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "50px 0", gap: "10px" }}>
                    
                    <img
                        src={deleteButton}
                        alt="Delete"
                        onClick={handleDelete}
                        style={{ 
                            cursor: "pointer", 
                            width: "80px", 
                            height: "50px" 
                        }}
                    />

                    
                    <img
                        src={enterButton}
                        alt="Enter"
                        onClick={handleSubmit}
                        style={{ 
                            cursor: "pointer", 
                            width: "80px", 
                            height: "50px" 
                        }}
                    />

                    <img 
                        src={newButton}
                        alt="New Problem"
                        onClick={handleNewProblem}
                        style={{ 
                            cursor: "pointer", 
                            width: "80px", 
                            height: "50px" 
                        }}
                    />
                    
                    <img
                        src={resetButton}
                        alt="Reset Score"
                        onClick={resetScore}
                        style={{ 
                            cursor: "pointer", 
                            width: "80px", 
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
