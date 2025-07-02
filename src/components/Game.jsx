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
import gearIcon from "../assets/images/icon_settings_gear2.png";
import aboutIcon from "../assets/images/icon_about2b.png";
import ImageButton from "./ImageButton";
import enterButton from "../assets/images/button_image_enter.png";
import newButton from "../assets/images/button_image_new_problem.png";
import resetButton from "../assets/images/button_image_reset_score.png";
import deleteButton from "../assets/images/button_image_delete.png";
import clickSound from "../assets/sounds/tap-notification-180637.mp3";
import successSound from "../assets/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
import errorSound from "../assets/sounds/error-11-352286.mp3";
import newSound from "../assets/sounds/new-notification-09-352705.mp3";
import resetSound from "../assets/sounds/harp-flourish-6251.mp3";
import switchSound from "../assets/sounds/back-tick-107822.mp3";
import SettingsMenu from "./SettingsMenu";
import AboutMenu from "./AboutMenu";

function Game() {
    console.log("Game.jsx component is loaded");
    const [operation, setOperation] = useState("+");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [correct, setCorrect] = useState(parseInt(localStorage.getItem("correct")) || 0);
    const [wrong, setWrong] = useState(parseInt(localStorage.getItem("wrong")) || 0);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    // 🎯 NEW: Difficulty and sound state
    const [difficulty, setDifficulty] = useState(localStorage.getItem("difficulty") || "쉬움");
    const [isSoundOn, setIsSoundOn] = useState(localStorage.getItem("soundEnabled") !== "false");

    const clickAudio = new Audio(clickSound);
    const successAudio = new Audio(successSound);
    const errorAudio = new Audio(errorSound);
    const newAudio = new Audio(newSound);
    const resetAudio = new Audio(resetSound);
    const switchAudio = new Audio(switchSound);
    
    const playSound = (audio) => {
        if (isSoundOn) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    // 🎯 UPDATED: Difficulty ranges mapping with allowNegative for subtraction
    const getDifficultyRanges = (difficulty) => {
        const ranges = {
            "쉬움": {
                addition: { min: 1, max: 10 },
                subtraction: { min: 1, max: 10, allowNegative: false },
                multiplication: { min: 1, max: 5 },
                division: { type: "easy" }
            },
            "보통": {
                addition: { min: 1, max: 50 },
                subtraction: { min: 1, max: 50, allowNegative: false },
                multiplication: { min: 5, max: 10 },
                division: { type: "medium" }
            },
            "어려움": {
                addition: { min: 1, max: 100 },
                subtraction: { min: 1, max: 100, allowNegative: true },
                multiplication: { min: 7, max: 12 },
                division: { type: "hard" }
            }
        };
        return ranges[difficulty];
    };

    // 🎯 NEW: Get current difficulty ranges
    const currentRanges = getDifficultyRanges(difficulty);
    
    const { problem: addProblem, generateNewProblem: newAddProblem } = useGameAdd(currentRanges.addition);
    const { problem: subtractProblem, generateNewProblem: newSubtractProblem } = useGameSubtract(currentRanges.subtraction);
    const { problem: multiplyProblem, generateNewProblem: newMultiplyProblem } = useGameMultiply(currentRanges.multiplication);
    const { problem: divideProblem, generateNewProblem: newDivideProblem } = useGameDivide(currentRanges.division);

    const problem = operation === "+" ? addProblem : operation === "-" ? subtractProblem : operation === "×" ? multiplyProblem : divideProblem ;
    const generateNewProblem = operation === "+" ? newAddProblem : operation === "-" ? newSubtractProblem : operation === "×" ? newMultiplyProblem : newDivideProblem ;

    // 🎯 UPDATED: Enhanced number click handler for decimal and negative support
    const handleNumberClick = (value) => {
        playSound(clickAudio);
        
        // Handle numeric input
        if (typeof value === 'number') {
            setUserAnswer((prev) => {
                // If the current answer is "0" or empty, replace it with the new number
                if (prev === "" || prev === "0") {
                    return value.toString();
                }
                // Otherwise, append the digit
                return prev + value.toString();
            });
        }
        // Handle decimal point
        else if (value === ".") {
            setUserAnswer((prev) => {
                // Don't allow multiple decimal points
                if (prev.includes(".")) {
                    return prev;
                }
                // If empty or just a negative sign, add "0."
                if (prev === "" || prev === "-") {
                    return prev + "0.";
                }
                // Otherwise, just add the decimal point
                return prev + ".";
            });
        }
        // Handle negative sign
        else if (value === "-") {
            setUserAnswer((prev) => {
                // If already negative, remove the negative sign
                if (prev.startsWith("-")) {
                    return prev.substring(1);
                }
                // If empty, just add the negative sign
                if (prev === "") {
                    return "-";
                }
                // Otherwise, add negative sign to the beginning
                return "-" + prev;
            });
        }
    }

    const handleDelete = () => {
        playSound(clickAudio);
        setUserAnswer((prev) => prev.slice(0,-1));
    }

    const handleSubmit = () => {
        if (hasSubmitted) return;
        
        // Don't allow submission of empty, incomplete, or invalid answers
        if (userAnswer === "" || userAnswer === "-" || userAnswer === "." || userAnswer === "-.") {
            return;
        }

        setHasSubmitted(true);

        // 🎯 NEW: Handle decimal answers for division
        const userValue = parseFloat(userAnswer);
        
        // Check if the parsed value is valid
        if (isNaN(userValue)) {
            setHasSubmitted(false);
            return;
        }
        
        const isCorrect = Math.abs(userValue - problem.solution) < 0.01; // Allow small floating point errors
        
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
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
                setTimeout(() => {
                    generateNewProblem();
                    setUserAnswer("");
                    setHasSubmitted(false);
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
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
                
                setTimeout(() => {
                    setHasSubmitted(false);
                }, 1000);
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

    // 🎯 NEW: Difficulty change handler
    const handleChangeDifficulty = (newDifficulty) => {
        setDifficulty(newDifficulty);
        localStorage.setItem("difficulty", newDifficulty);
        // Generate new problem with new difficulty
        setTimeout(() => {
            generateNewProblem();
            setUserAnswer("");
            setHasSubmitted(false);
        }, 100);
    };

// 🎯 FIXED: Sound toggle handler with functional update
const handleToggleSound = () => {
    console.log(`🔊 handleToggleSound called. Current isSoundOn: ${isSoundOn}`);
    
    setIsSoundOn(prevState => {
        const newSoundState = !prevState;
        console.log(`🔊 Setting sound from ${prevState} to ${newSoundState}`);
        localStorage.setItem("soundEnabled", newSoundState.toString());
        
        // Play test sound when enabling (use prevState to avoid race condition)
        if (newSoundState) {
            const testAudio = new Audio(clickSound);
            testAudio.currentTime = 0;
            testAudio.play();
        }
        
        return newSoundState;
    });
};

    const total = correct + wrong;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

           <SettingsMenu 
                onNewProblem={handleNewProblem}
                onResetScore={resetScore}
                clickSound={clickSound}
                gearIcon={gearIcon}
                onChangeDifficulty={handleChangeDifficulty}
                onToggleSound={handleToggleSound}
                isSoundOn={isSoundOn}
                currentDifficulty={difficulty}
            />

            <AboutMenu 
                aboutIcon={aboutIcon}
            />

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', fontFamily: 'arial'}}>
                <Header score={score} correct={correct} total={total} feedback={feedback} />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px 0", backgroundColor: '#FFFFFF', fontFamily: 'arial' }}>
               <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
               
               <ImageButton
                src={addIcon}
                alt="Addition"
                onAction={() => {
                    playSound(switchAudio);
                    setOperation("+");
                    setHasSubmitted(false);
                }}
                style={{
                    width: "50px",
                    height: "75px",
                    border: operation === "+" ? "2px solid blue" : "none",
                    borderRadius: "8px",
                }}
                />

                <ImageButton
                    src={subtractIcon}
                    alt="Subtraction"
                    onAction={() => {
                        playSound(switchAudio);
                        setOperation("-");
                        setHasSubmitted(false);
                    }}
                    style={{
                        width: "50px",
                        height: "75px",
                        border: operation === "-" ? "2px solid blue" : "none",
                        borderRadius: "8px",
                    }}
                />

                <ImageButton
                    src={multiplyIcon}
                    alt="Multiplication"
                    onAction={() => {
                        playSound(switchAudio);
                        setOperation("×");
                        setHasSubmitted(false);
                    }}
                    style={{
                        width: "50px",
                        height: "75px",
                        border: operation === "×" ? "2px solid blue" : "none",
                        borderRadius: "8px",
                    }}
                />

                <ImageButton
                    src={divideIcon}
                    alt="Division"
                    onAction={() => {
                        playSound(switchAudio);
                        setOperation("÷");
                        setHasSubmitted(false);
                    }}
                    style={{
                        width: "50px",
                        height: "75px",
                        border: operation === "÷" ? "2px solid blue" : "none",
                        borderRadius: "8px",
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
                    
                    <ImageButton
                    src={deleteButton}
                    alt="Delete"
                    onAction={handleDelete}
                    style={{ width: "80px", height: "50px" }}
                    />

                    <ImageButton
                    src={enterButton}
                    alt="Enter"
                    onAction={handleSubmit}
                    style={{ width: "80px", height: "50px" }}
                    />

                </div>
            </div>
       
        <ToastContainer />
        </div>
    );
}

export default Game;