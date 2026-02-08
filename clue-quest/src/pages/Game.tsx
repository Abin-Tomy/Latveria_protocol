import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "@/components/Timer";
import { AnswerInput } from "@/components/AnswerInput";
import ClockPuzzle from "@/components/puzzles/ClockPuzzle";
import { URLPuzzle } from "@/components/puzzles/URLPuzzle";
import { CrosswordPuzzle } from "@/components/puzzles/CrosswordPuzzle";
import { MorseCodePuzzle } from "@/components/puzzles/MorseCodePuzzle";
import DesktopPuzzle from "@/components/puzzles/DesktopPuzzle";
import { AvengersPuzzle } from "@/components/puzzles/AvengersPuzzle";
import { CodeCrackerPuzzle } from "@/components/puzzles/CodeCrackerPuzzle";
import { OpticalPuzzle } from "@/components/puzzles/OpticalPuzzle";
import { PhoneKeypadPuzzle } from "@/components/puzzles/PhoneKeypadPuzzle";
import { ThreeDoorsPuzzle } from "@/components/puzzles/ThreeDoorsPuzzle";
import { FloorPlanPuzzle } from "@/components/puzzles/FloorPlanPuzzle";

import { VideoPuzzle } from "@/components/puzzles/VideoPuzzle";
import { MCQPuzzle } from "@/components/puzzles/MCQPuzzle";
import { ConsequencePuzzle } from "@/components/puzzles/ConsequencePuzzle";
import { TPuzzle } from "@/components/puzzles/TPuzzle";
import { RotaryDialPuzzle } from "@/components/puzzles/RotaryDialPuzzle";
import { LogOut, Shield, Zap, Info, Cpu, Terminal as TerminalIcon, SkipForward, SkipBack, Lightbulb, X } from "lucide-react";
import { GameCompletion } from "@/components/GameCompletion";

interface Level {
    id: number;
    title: string;
    type: "clock" | "url" | "crossword" | "morse" | "filesystem" | "avengers" | "codecracker" | "still" | "phonekeypad" | "threedoors" | "floorplan" | "video" | "text" | "mcq" | "consequence" | "tpuzzle" | "rotary";
    content: string;
    hint?: string;
}

// Local level data - answers validated client-side in each puzzle component
const LEVEL_DATA: Level[] = [
    { id: 1, title: "Temporal Decryption", type: "clock", content: "Synchronize the arrows", hint: "The time shown is the answer" },
    { id: 2, title: "URL Cipher", type: "url", content: "", hint: "Look closely at the URL" },
    { id: 3, title: "Morse Transmission", type: "morse", content: "", hint: "Use the Morse code reference" },
    { id: 4, title: "Video Analysis", type: "video", content: "", hint: "Watch carefully" },
    { id: 5, title: "Filesystem", type: "filesystem", content: "Tom is in the library. He is reading. Find the book and discover the answer key hidden within the archives.", hint: "Explore the desktop" },
    { id: 6, title: "Optical Challenge", type: "still", content: "", hint: "Look at the image" },
    { id: 7, title: "Knowledge Test", type: "mcq", content: "", hint: "Choose wisely" },
    { id: 8, title: "Phone Keypad", type: "phonekeypad", content: "", hint: "Old school texting" },
    { id: 9, title: "Crossword", type: "crossword", content: "", hint: "Fill in the blanks" },
    { id: 10, title: "Floor Plan", type: "floorplan", content: "", hint: "Navigate the building" },
    { id: 11, title: "Three Doors", type: "threedoors", content: "", hint: "Binary patterns" },
    { id: 12, title: "Code Cracker", type: "codecracker", content: "", hint: "3 digit code" },
    { id: 13, title: "T-Puzzle", type: "tpuzzle", content: "", hint: "Form the letter T" },
    { id: 14, title: "Consequence", type: "consequence", content: "", hint: "Time matters" },
    { id: 15, title: "Rotary Dial", type: "rotary", content: "", hint: "Dial the number" },
];

const TOTAL_LEVELS = 15;

const Game = () => {
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(1);
    const [levelData, setLevelData] = useState<Level | null>(null);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [teamId, setTeamId] = useState("");
    const [teamName, setTeamName] = useState("");
    const [agent1, setAgent1] = useState("");
    const [agent2, setAgent2] = useState("");
    const [successDialogue, setSuccessDialogue] = useState<string | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showIntelBulb, setShowIntelBulb] = useState(false);
    const [intelOpen, setIntelOpen] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showMorseModal, setShowMorseModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const teamData = localStorage.getItem("lockstep_team");
        if (!teamData) {
            navigate("/");
            return;
        }

        const parsed = JSON.parse(teamData);
        setTeamId(parsed.teamId);
        setTeamName(parsed.teamName);
        setAgent1(parsed.agent1);
        setAgent2(parsed.agent2);
        setStartTime(new Date(parsed.startTime));
        // In a real app, token would come from login response and be stored securely
        // For this demo/migration, we might need to assume a session or fetch it
        // If we don't have a token mechanism set up in frontend yet, we might rely on session auth
        // or just local state for now if backend auth is disabled/lenient.
        // setToken(parsed.token); 

        const savedLevel = localStorage.getItem("lockstep_level");
        let initialLevel = 1;
        if (savedLevel) {
            initialLevel = parseInt(savedLevel);
        }
        setCurrentLevel(initialLevel);

    }, [navigate]);

    // Load level data from local LEVEL_DATA array
    const loadLevelData = useCallback((levelNumber: number) => {
        if (levelNumber > TOTAL_LEVELS) {
            setGameCompleted(true);
            return;
        }

        const level = LEVEL_DATA.find(l => l.id === levelNumber);
        if (level) {
            setLevelData(level);
        }
    }, []);

    // Effect to load level data when currentLevel changes
    useEffect(() => {
        loadLevelData(currentLevel);
    }, [currentLevel, loadLevelData]);


    useEffect(() => {
        // Timer for showing the intel bulb after 5 minutes (300 seconds) - for layer 1 and 11
        if (currentLevel === 1 || currentLevel === 11) {
            const timer = setInterval(() => {
                setTimeElapsed(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 300 && !showIntelBulb) {
                        setShowIntelBulb(true);
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setShowIntelBulb(false);
            setTimeElapsed(0);
        }
    }, [currentLevel, showIntelBulb]);

    useEffect(() => {
        setIntelOpen(false);
    }, [currentLevel]);

    // Save completion time to localStorage when game is completed
    useEffect(() => {
        if (gameCompleted && teamName) {
            const completionTimeSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);

            // Save completion data to localStorage
            const completionData = {
                teamName: teamName,
                teamId: teamId,
                completionTimeSeconds: completionTimeSeconds,
                completedAt: new Date().toISOString(),
                startTime: startTime.toISOString()
            };

            // Save current completion
            localStorage.setItem("lockstep_completion", JSON.stringify(completionData));

            // Also append to completion history
            const history = localStorage.getItem("lockstep_completion_history");
            const completionHistory = history ? JSON.parse(history) : [];
            completionHistory.push(completionData);
            localStorage.setItem("lockstep_completion_history", JSON.stringify(completionHistory));

            console.log('Game completed! Time:', completionTimeSeconds, 'seconds');
        }
    }, [gameCompleted, teamName, teamId, startTime]);


    // Generic wrapper for puzzles that just say "I'm done"
    const handleGenericSolve = async (solution?: string): Promise<boolean> => {
        let answerToSend = solution || "";

        // Special case handling if components don't pass args yet
        if (!answerToSend) {
            if (currentLevel === 1) answerToSend = "CLOCK_SOLVED";
            else if (currentLevel === 13) answerToSend = "TANGRAM"; // T-Puzzle
            else answerToSend = "SOLVED";
        }

        return await handleAnswer(answerToSend);
    }



    // Handle successful puzzle completion - all validation done client-side
    const handleAnswer = async (_answer: string): Promise<boolean> => {
        // This function is called when a puzzle is solved
        // The puzzle components handle their own answer validation
        // This just handles the level progression

        const messages = [
            "IMPUDENT FOOL! YOU'VE BYPASSED ONE LAYER, BUT MY MAINFRAME REMAINS ABSOLUTE.",
            "DO YOU THINK ONE DECRYPTED NODE MAKES YOU AN AGENT? PATHETIC.",
            "YOU'RE NAVIGATING MY WORLD NOW. DON'T GET COMFORTABLE.",
            "A MINOR SETBACK. MY SYSTEM HAS BILLIONS OF PROCESSES YOU CANNOT COMPREHEND.",
            "INCONSIDERABLE PROGRESS. THE DOOMSDAY CLOCK STILL TICKS."
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setSuccessDialogue(randomMsg);

        // Display dialogue for 3.5 seconds before progressing
        setTimeout(() => {
            setSuccessDialogue(null);
            const nextLevel = currentLevel + 1;
            if (nextLevel > TOTAL_LEVELS) {
                setGameCompleted(true);
            } else {
                setCurrentLevel(nextLevel);
                localStorage.setItem("lockstep_level", nextLevel.toString());
            }
        }, 3500);

        return true;
    };

    const handleLogout = () => {
        localStorage.removeItem("lockstep_team");
        localStorage.removeItem("lockstep_level");
        navigate("/");
    };

    const handleSkipLevel = () => {
        if (currentLevel < TOTAL_LEVELS) {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            localStorage.setItem("lockstep_level", nextLevel.toString());
        } else {
            setGameCompleted(true);
        }
    };

    const handlePreviousLevel = () => {
        if (currentLevel > 1) {
            const prevLevel = currentLevel - 1;
            setCurrentLevel(prevLevel);
            localStorage.setItem("lockstep_level", prevLevel.toString());
        }
    };


    if (gameCompleted) {
        return (
            <GameCompletion
                teamName={localStorage.getItem("lockstep_team")}
                startTime={startTime}
                onReset={handleLogout}
            />
        );
    }

    if (loading) {
        return (
            <div className="h-screen bg-black text-primary font-mono flex items-center justify-center">
                <div className="animate-pulse">ESTABLISHING SECURE CONNECTION...</div>
            </div>
        );
    }

    if (error || !levelData) {
        return (
            <div className="h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center gap-4 p-4 text-center">
                <div className="text-xl font-bold animate-pulse">ERROR: {error || "DATA CORRUPTION DETECTED"}</div>
                <button
                    onClick={() => loadLevelData(currentLevel)}
                    className="px-4 py-2 border border-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-widest text-sm"
                >
                    RETRY CONNECTION
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="text-xs text-red-500/60 hover:text-red-500 mt-4 underline"
                >
                    RETURN TO LOGIN
                </button>
            </div>
        );
    }

    const currentPuzzleType = levelData.type;

    return (
        <div className="h-screen bg-background text-foreground font-['Press_Start_2P'] flex flex-col relative overflow-hidden">

            {/* Global Emerald Grid Background */}
            <div className="fixed inset-0 noise opacity-20 pointer-events-none z-0" />
            <div
                className="fixed inset-0 opacity-5 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                        linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px"
                }}
            />

            {/* Top Header Bar */}
            <header className="h-16 flex items-center justify-between px-8 border-b-2 border-primary/20 bg-black/40 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <span className="text-primary text-xs md:text-sm tracking-widest animate-pulse">DOOMSDAY//PROTOCOL</span>
                    <span className="text-[9px] text-muted-foreground/60 tracking-wide hidden md:inline">// V. VON DOOM</span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Cpu className="w-3 h-3 text-primary" />
                        DOOM MAINFRAME V6.6.6
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-primary/40 text-[10px] text-primary hover:bg-primary/20 transition-all rounded"
                    >
                        <LogOut className="w-3 h-3" />
                        LOGOUT
                    </button>
                </div>
            </header>

            {/* Main 3-Column Content Dashboard */}
            <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 z-10 overflow-hidden">

                {/* Left Column: Security Layers */}
                <section className="w-full md:w-1/4 h-full flex flex-col">
                    <div className="border-2 border-primary/10 bg-black/20 p-4 rounded backdrop-blur-sm flex-1 flex flex-col min-h-0">
                        <div className="text-xs text-primary/60 mb-4 border-b border-primary/10 pb-2 flex justify-between items-center flex-shrink-0">
                            <span>SECURITY LAYERS</span>
                            <div className="flex items-center gap-2">
                                <span>{currentLevel}/{TOTAL_LEVELS}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent min-h-0">
                            {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((id) => (
                                <div
                                    key={id}
                                    className={`flex items-center gap-3 p-3 border rounded text-xs transition-all duration-300 flex-shrink-0 ${id === currentLevel
                                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,100,0.2)]"
                                        : id < currentLevel
                                            ? "border-primary/20 text-primary/40"
                                            : "border-white/5 text-muted-foreground/30 grayscale"
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${id === currentLevel ? "bg-primary animate-pulse" : id < currentLevel ? "bg-primary/40" : "bg-white/10"}`} />
                                    <div className="flex flex-col">
                                        <span className="font-bold">LAYER {id.toString().padStart(2, '0')}</span>
                                        <span className="text-[10px] opacity-60">
                                            {id === currentLevel ? "IN PROGRESS" : id < currentLevel ? "BREACHED" : "ENCRYPTED"}
                                        </span>
                                    </div>
                                    {id < currentLevel && <Zap className="w-3 h-3 ml-auto text-primary" />}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-3 border-t border-primary/10 text-xs flex justify-between text-muted-foreground/50 flex-shrink-0">
                            <span>PROGRESS</span>
                            <span>{Math.round((currentLevel / TOTAL_LEVELS) * 100)}%</span>
                        </div>

                        {/* Skip / Previous Buttons */}
                        <div className="flex gap-2 mt-3 flex-shrink-0">
                            <button
                                onClick={handlePreviousLevel}
                                disabled={currentLevel <= 1}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-primary/40 text-[10px] text-primary hover:bg-primary/20 transition-all rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <SkipBack className="w-3 h-3" />
                                PREV
                            </button>
                            <button
                                onClick={handleSkipLevel}
                                disabled={currentLevel >= TOTAL_LEVELS}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-primary/40 text-[10px] text-primary hover:bg-primary/20 transition-all rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                SKIP
                                <SkipForward className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Middle Column: Decryption Challenge (The Main Box) */}
                <section className="flex-1 h-full relative border-2 border-primary/30 rounded-lg overflow-hidden flex flex-col shadow-2xl glow-primary">


                    {/* Content inside Box */}
                    <div className="relative z-10 flex-1 flex flex-col p-2 min-h-0">
                        <div className="flex-1 flex flex-col min-h-0">

                            <AnimatePresence mode="wait">
                                {currentPuzzleType === "clock" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <ClockPuzzle
                                            onCorrectAnswer={() => handleGenericSolve("CLOCK_SOLVED")}
                                            onSolve={() => handleGenericSolve("CLOCK_SOLVED")}
                                            level={1}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "url" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <URLPuzzle onSolve={handleGenericSolve} level={2} />
                                    </motion.div>
                                ) : currentPuzzleType === "crossword" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col items-center justify-center"
                                    >
                                        <CrosswordPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "morse" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col items-center justify-center overflow-y-auto"
                                    >
                                        <MorseCodePuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "filesystem" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col overflow-y-auto p-4"
                                    >
                                        <DesktopPuzzle
                                            level={currentLevel}
                                            puzzle={{
                                                question: levelData.content,
                                                answer: "" // Hidden content
                                            }}
                                            onCorrectAnswer={() => handleGenericSolve("GATWAY")}
                                            onWrongAnswer={() => {
                                                // Wrong answer feedback
                                            }}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "avengers" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <AvengersPuzzle
                                            onSolve={handleGenericSolve}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "codecracker" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <CodeCrackerPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "still" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <OpticalPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "phonekeypad" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <PhoneKeypadPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "floorplan" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <FloorPlanPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "mcq" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <MCQPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "threedoors" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <ThreeDoorsPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "video" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <VideoPuzzle
                                            onSolve={handleGenericSolve}
                                            level={currentLevel}
                                            answer={""} // Hidden
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "tpuzzle" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <TPuzzle
                                            onSolve={handleGenericSolve}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "consequence" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <ConsequencePuzzle
                                            onSolve={handleGenericSolve}
                                            onWrongAnswer={() => {
                                                setCurrentLevel(1);
                                                localStorage.setItem("lockstep_level", "1");
                                                setSuccessDialogue("TIMELINE RESET INITIATED due to incorrect choice.");
                                                setTimeout(() => setSuccessDialogue(null), 3000);
                                            }}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzleType === "rotary" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <RotaryDialPuzzle
                                            onSolve={handleGenericSolve}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="bg-black/60 border-2 border-primary/20 p-6 md:p-10 rounded shadow-inner text-xs md:text-sm leading-loose tracking-wide overflow-y-auto max-h-[250px]"
                                    >
                                        <p className="whitespace-pre-wrap">{levelData?.content}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Integrated Answer Area - Only for text puzzles */}
                            {currentPuzzleType !== "clock" && currentPuzzleType !== "url" && currentPuzzleType !== "crossword" && currentPuzzleType !== "morse" && currentPuzzleType !== "filesystem" && currentPuzzleType !== "avengers" && currentPuzzleType !== "codecracker" && currentPuzzleType !== "still" && currentPuzzleType !== "phonekeypad" && currentPuzzleType !== "threedoors" && currentPuzzleType !== "floorplan" && currentPuzzleType !== "video" && currentPuzzleType !== "mcq" && currentPuzzleType !== "consequence" && currentPuzzleType !== "tpuzzle" && currentPuzzleType !== "rotary" && (
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-2 text-primary/60 text-[8px]">
                                        <span>{">"} ENTER DECRYPTION KEY...</span>
                                    </div>
                                    <AnswerInput
                                        onSubmit={handleAnswer}
                                        cooldown={5}
                                        compactView={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Column: System Status */}
                <section className="w-full md:w-1/4 h-full flex flex-col border-2 border-primary/10 bg-black/20 p-4 rounded backdrop-blur-sm">
                    <div className="space-y-4 flex-1 flex flex-col">

                        {/* Timer */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Info className="w-3 h-3" />
                                <span className="animate-pulse text-red-500">SYSTEM CLOCK</span>
                            </div>
                            <div className="p-4 bg-black/40 border border-primary/20 rounded text-center">
                                <Timer startTime={startTime} />
                            </div>
                        </div>

                        {/* Active Unit */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Zap className="w-3 h-3" />
                                <span>ACTIVE UNIT</span>
                            </div>
                            <div className="p-4 bg-black/40 border border-primary/20 rounded">
                                <div className="text-primary text-[10px] mb-2 uppercase font-bold">{teamName || "TEAM"}</div>
                                <div className="text-[8px] text-muted-foreground opacity-60 uppercase">{agent1 || "AGENT 1"} • {agent2 || "AGENT 2"}</div>
                            </div>
                        </div>

                        {/* Current Objective */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Shield className="w-3 h-3" />
                                <span>CURRENT OBJECTIVE</span>
                            </div>
                            <div className="p-4 bg-black/40 border border-primary/20 rounded text-[10px] text-primary animate-pulse">
                                BREACH LAYER {currentLevel.toString().padStart(2, '0')}
                            </div>
                        </div>

                        {/* Intel Display */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Info className="w-3 h-3" />
                                <span>INTEL</span>
                            </div>

                            {/* Standard Intel Button for Hint Display */}
                            <div className="p-4 bg-black/40 border border-primary/20 rounded">
                                {!intelOpen ? (
                                    <button
                                        onClick={() => setIntelOpen(true)}
                                        className="w-full text-[8px] uppercase tracking-wider font-semibold py-2 px-3 rounded transition-all duration-300 bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span className="relative animate-pulse flex items-center justify-center gap-2">
                                            <Lightbulb className="w-3 h-3" />
                                            ACCESS INTEL
                                        </span>
                                    </button>
                                ) : (
                                    <div className="space-y-3 relative">
                                        <button
                                            onClick={() => setIntelOpen(false)}
                                            className="absolute -top-2 -right-2 text-primary/50 hover:text-primary transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>

                                        <div className="pt-2">
                                            {currentLevel === 3 ? (
                                                <img
                                                    src="/morse-code.jpeg"
                                                    alt="Morse Code Reference"
                                                    className="w-full max-w-[70%] mx-auto h-auto rounded border border-primary/30 cursor-pointer hover:border-primary/50 transition-all"
                                                    onClick={() => setShowMorseModal(true)}
                                                />
                                            ) : currentLevel === 11 ? (
                                                !showIntelBulb ? (
                                                    <div className="text-[10px] uppercase text-muted-foreground text-center font-mono animate-pulse">
                                                        INTEL CLASSIFIED <br />
                                                        <span className="text-primary font-bold">
                                                            {Math.floor((300 - timeElapsed) / 60)}:{(300 - timeElapsed) % 60 < 10 ? '0' : ''}{(300 - timeElapsed) % 60}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-2 overflow-x-auto text-[10px] font-mono leading-normal whitespace-nowrap p-1">
                                                        <div className="text-blue-300 pb-1 border-b border-white/10">
                                                            <span className="font-bold text-primary block text-xs mb-0.5">DOOR 1:</span>
                                                            <span className="tracking-wide">000→100→001→101→010→110→011→111</span>
                                                        </div>
                                                        <div className="text-green-300 pb-1 border-b border-white/10">
                                                            <span className="font-bold text-primary block text-xs mb-0.5">DOOR 2:</span>
                                                            <span className="tracking-wide">000→010→100→110→001→011→101→111</span>
                                                        </div>
                                                        <div className="text-red-300 pb-0">
                                                            <span className="font-bold text-primary block text-xs mb-0.5">DOOR 3:</span>
                                                            <span className="tracking-wide">000→001→010→011→100→101→110→111</span>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <p className="text-[10px] font-medium tracking-wide text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                    {levelData?.hint || "NO INTEL AVAILABLE."}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

                {/* Success Dialogue Overlay */}
                <AnimatePresence>
                    {successDialogue && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="fixed bottom-8 right-8 z-50 flex items-end justify-end p-4 font-mono pointer-events-none"
                        >
                            <div className="flex flex-col md:flex-row gap-2 items-end max-w-xl">
                                {/* Message Box */}
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex-1 bg-black border border-green-500 p-4 relative shadow-[0_0_15px_rgba(34,197,94,0.15)] w-full"
                                >
                                    {/* Decorative Corner Accents */}
                                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-green-500" />
                                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500" />
                                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-green-500" />
                                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500" />

                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-green-500/30 text-green-500">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-3 h-3 animate-pulse" />
                                            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">
                                                INCOMING COMM // DR. DOOM
                                            </span>
                                        </div>
                                        <TerminalIcon className="w-3 h-3 opacity-50" />
                                    </div>

                                    {/* Main Message */}
                                    <h2 className="text-white text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed mb-3 drop-shadow-md">
                                        {successDialogue}
                                    </h2>

                                    {/* Footer */}
                                    <div className="text-right">
                                        <span className="text-green-500/50 text-[9px] md:text-[10px] tracking-[0.2em] uppercase animate-pulse">
                                            ENCRYPTING NEXT LAYER...
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Image Box */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-24 h-24 md:w-32 md:h-32 border border-green-500 bg-black p-1 flex-shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.15)] relative"
                                >
                                    <div className="absolute inset-0 bg-green-500/5 z-0" />
                                    <img
                                        src="/dr-doom-latest.png"
                                        alt="Dr. Doom"
                                        className="w-full h-full object-contain relative z-10"
                                    />
                                    {/* Scanline Effect Overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 z-20" />
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Morse Code Modal */}
                {showMorseModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowMorseModal(false)}>
                        <div className="relative max-w-4xl w-full bg-black border-2 border-primary/50 rounded-lg p-2 shadow-2xl">
                            <button
                                onClick={() => setShowMorseModal(false)}
                                className="absolute -top-4 -right-4 bg-black border border-primary text-primary rounded-full p-2 hover:bg-primary/20"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <img
                                src="/morse-code.jpeg"
                                alt="Morse Code Reference"
                                className="w-full h-auto rounded"
                            />
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Game;
