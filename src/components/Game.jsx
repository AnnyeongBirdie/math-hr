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
import { useGameSounds } from "../hooks/useGameSound";
import SettingsMenu from "./SettingsMenu";
import AboutMenu from "./AboutMenu";
import DifficultyBadge from "./DifficultyBadge";

function Game() {
    console.log("Game.jsx component is loaded");
    // State
    const [operation, setOperation] = useState("+");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [correct, setCorrect] = useState(parseInt(localStorage.getItem("correct")) || 0);
    const [wrong, setWrong] = useState(parseInt(localStorage.getItem("wrong")) || 0);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [inputLimitReached, setInputLimitReached] = useState(false);

    // Difficulty and sound state
    const [difficulty, setDifficulty] = useState(localStorage.getItem("difficulty") || "쉬움");

    const {
        isSoundOn,
        handleToggleSound,
        playClick,
        playSuccess,
        playError,
        playNew,
        playReset,
        playSwitch,
    } = useGameSounds();

const getResponsiveFontSize = (text) => {
    const length = text.length;
    if (length <= 5) return '72px';   // Increased from 50px
    if (length <= 8) return '58px';   // Increased from 40px
    if (length <= 10) return '48px';  // Increased from 32px
    if (length <= 12) return '42px';  // New tier
    if (length <= 15) return '36px';  // New tier
    return '32px';                    // Increased from 26px
};

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
       playClick();
    
    // Handle numeric input
    if (typeof value === 'number') {
        setUserAnswer((prev) => {
            // Check if we're at the limit
            if (prev.length >= 8) {
                // Show visual feedback that limit is reached
                setInputLimitReached(true);
                setTimeout(() => setInputLimitReached(false), 300);
                return prev;
            }
            
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
            // Check limit
            if (prev.length >= 8) {
                setInputLimitReached(true);
                setTimeout(() => setInputLimitReached(false), 300);
                return prev;
            }
            
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
    // Handle negative sign (doesn't count toward character limit)
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
};

    const handleDelete = () => {
        playClick();
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
                playSuccess();
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
                playError();
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
        playNew();
        generateNewProblem();
        setFeedback(""); 
        setUserAnswer("");
        setHasSubmitted(false);
    };

    const resetScore = () => {
        playReset();
        setFeedback("");
        setUserAnswer("");
        setCorrect(0);
        setWrong(0);
        localStorage.setItem("correct", 0);
        localStorage.setItem("wrong", 0);
    };

    // 🎯 NEW: Difficulty change handler
// Update the handleChangeDifficulty function to use toast ID
const handleChangeDifficulty = (newDifficulty) => {
    // Don't change if it's already the current difficulty
    if (newDifficulty === difficulty) {
        return;
    }
    
    const getDifficultyConfig = (difficulty) => {
        switch (difficulty) {
            case "쉬움":
                return { emoji: "🌱", text: "쉬움 모드" };
            case "보통":
                return { emoji: "⚡", text: "보통 모드" };
            case "어려움":
                return { emoji: "🔥", text: "어려움 모드" };
            default:
                return { emoji: "🌱", text: "쉬움 모드" };
        }
    };

    const config = getDifficultyConfig(newDifficulty);
    
    // Use toast ID to prevent duplicates
    toast.info(`${config.emoji} ${config.text}로 변경되었습니다!`, {
        toastId: `difficulty-${newDifficulty}`, // This prevents duplicate toasts
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
    });

    setDifficulty(newDifficulty);
    localStorage.setItem("difficulty", newDifficulty);
    
    // Generate new problem with new difficulty
    setTimeout(() => {
        generateNewProblem();
        setUserAnswer("");
        setHasSubmitted(false);
    }, 100);
};

    const total = correct + wrong;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <div
            style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none",
                WebkitUserDrag: "none"
            }}
        >
            <br></br>
            <br></br>
            <br></br>
            <br></br>

           <SettingsMenu 
                onNewProblem={handleNewProblem}
                onResetScore={resetScore}
                playClick={playClick}
                gearIcon={gearIcon}
                onChangeDifficulty={handleChangeDifficulty}
                onToggleSound={handleToggleSound}
                isSoundOn={isSoundOn}
                currentDifficulty={difficulty}
            />

            <AboutMenu 
                aboutIcon={aboutIcon}
            />

             <DifficultyBadge difficulty={difficulty} />

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', fontFamily: 'arial'}}>
                <Header score={score} correct={correct} total={total} feedback={feedback} />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px 0", backgroundColor: '#FFFFFF', fontFamily: 'arial' }}>
               <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
               
               <ImageButton
                src={addIcon}
                alt="Addition"
                onAction={() => {
                    playSwitch();
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
                        playSwitch();
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
                        playSwitch();
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
                        playSwitch();
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
                    fontSize: getResponsiveFontSize(`${problem.term1} ${problem.symbol} ${problem.term2} = ${userAnswer || "?"}`),
                    fontWeight: 'bold',
                    color: inputLimitReached ? '#e74c3c' : '#636363', // Red when limit reached
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'arial',
                    padding: '10px',
                    maxWidth: '90vw',
                    transition: 'color 0.3s ease', // Smooth color transition
                    transform: inputLimitReached ? 'scale(1.02)' : 'scale(1)', // Slight scale effect
                }}>
                <p style={{ margin: '0', textAlign: 'center' , height:'60px'}}>
                    {problem.term1} {problem.symbol} {problem.term2} = {userAnswer || "?"}
                </p>
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