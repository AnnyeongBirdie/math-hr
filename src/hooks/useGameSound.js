import { useEffect, useRef, useState } from "react";
import clickSound from "../assets/sounds/tap-notification-180637.mp3";
import successSound from "../assets/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
import errorSound from "../assets/sounds/error-11-352286.mp3";
import newSound from "../assets/sounds/new-notification-09-352705.mp3";
import resetSound from "../assets/sounds/harp-flourish-6251.mp3";
import switchSound from "../assets/sounds/back-tick-107822.mp3";

export function useGameSounds() {
    const [isSoundOn, setIsSoundOn] = useState(() => {
        const stored = localStorage.getItem("soundEnabled");
        return stored !== "false";
    });

    const soundsRef = useRef({});

    useEffect(() => {
        soundsRef.current = {
            click: new Audio(clickSound),
            success: new Audio(successSound),
            error: new Audio(errorSound),
            new: new Audio(newSound),
            reset: new Audio(resetSound),
            switch: new Audio(switchSound),
        };
    }, []);

    const play = (name) => {
        if (!isSoundOn) return;
        const audio = soundsRef.current[name];
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    };

    return {
        isSoundOn,
        handleToggleSound: () => {
            setIsSoundOn((prev) => {
                const newState = !prev;
                localStorage.setItem("soundEnabled", newState.toString());
                return newState;
            });
        },
        playClick: () => play("click"),
        playSuccess: () => play("success"),
        playError: () => play("error"),
        playNew: () => play("new"),
        playReset: () => play("reset"),
        playSwitch: () => play("switch"),
    };
}