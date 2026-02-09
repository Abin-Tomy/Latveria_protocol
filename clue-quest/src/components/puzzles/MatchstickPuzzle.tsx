import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Delete, Check } from "lucide-react";

interface MatchstickPuzzleProps {
    onSolve?: (answer: string) => void;
}

// Matchstick definitions for 7-segment display
// A: Top, B: Top-Right, C: Bottom-Right, D: Bottom, E: Bottom-Left, F: Top-Left, G: Middle
type Segment = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

const DIGIT_SEGMENTS: Record<number, Segment[]> = {
    0: ['A', 'B', 'C', 'D', 'E', 'F'],
    1: ['B', 'C'],
    2: ['A', 'B', 'G', 'E', 'D'],
    3: ['A', 'B', 'G', 'C', 'D'],
    4: ['F', 'G', 'B', 'C'],
    5: ['A', 'F', 'G', 'C', 'D'],
    6: ['A', 'F', 'E', 'D', 'C', 'G'],
    7: ['A', 'B', 'C'],
    8: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    9: ['A', 'F', 'B', 'G', 'C', 'D'], // 9 usually lacks E
};

const MatchstickPuzzle = ({ onSolve }: MatchstickPuzzleProps) => {
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
    const [isAnimating, setIsAnimating] = useState(false);

    const handleKeypad = (val: string) => {
        if (status === "success" || isAnimating) return;
        if (val === "CLEAR") {
            setInput("");
            setStatus("idle");
        } else if (val === "OK") {
            checkAnswer();
        } else {
            if (input.length < 5) {
                setInput(prev => prev + val);
            }
        }
    };

    const checkAnswer = () => {
        if (input === "31181") {
            setStatus("success");
            setIsAnimating(true);
            setTimeout(() => {
                onSolve?.("31181");
            }, 3000); // Wait for animation
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 1000);
        }
    };

    // --- RENDER HELPERS ---

    // Coordinate mapping for matchsticks (relative to 100x180 box)
    // Matches are drawn as rounded rects
    const coords: Record<Segment, { x: number, y: number, w: number, h: number, vertical: boolean }> = {
        A: { x: 15, y: 5, w: 70, h: 8, vertical: false },
        B: { x: 87, y: 15, w: 8, h: 70, vertical: true },
        C: { x: 87, y: 95, w: 8, h: 70, vertical: true },
        D: { x: 15, y: 167, w: 70, h: 8, vertical: false },
        E: { x: 5, y: 95, w: 8, h: 70, vertical: true },
        F: { x: 5, y: 15, w: 8, h: 70, vertical: true },
        G: { x: 15, y: 86, w: 70, h: 8, vertical: false },
    };

    const DrawDigit = ({ digit, index, animateMove }: { digit: number, index: number, animateMove?: boolean }) => {
        const segments = DIGIT_SEGMENTS[digit];

        return (
            <div className="relative w-[100px] h-[180px] mx-2">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((seg) => {
                    const s = seg as Segment;
                    const isActive = segments.includes(s);
                    const { x, y, w, h, vertical } = coords[s];

                    // MOVES DEFINITION for 308 -> 31181
                    // 0 (Index 1) Top (A) -> End (Index 3) Top-Right (B) [Rotates 90]
                    const isMove1Source = animateMove && index === 1 && s === 'A';
                    // 0 (Index 1) Bottom (D) -> End (Index 3) Bottom-Right (C) [Rotates 90]
                    const isMove2Source = animateMove && index === 1 && s === 'D';

                    const isMovingStick = isMove1Source || isMove2Source;

                    if (!isActive && !isMovingStick) return null;

                    if (isMove1Source) {
                        return (
                            <motion.div
                                key={`${index}-${s}-moving-1`}
                                layoutId="moving-stick-1"
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    // Index 1 (0) Top (A) to Index 3 (1) Top-Right (B)
                                    x: isAnimating ? 304 : 0,
                                    y: isAnimating ? 10 : 0,
                                    rotate: isAnimating ? 90 : 0
                                }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className={cn(
                                    "absolute rounded-full shadow-[0_0_10px_#22c55e]",
                                    "bg-gradient-to-br from-primary via-primary to-primary/50"
                                )}
                                style={{
                                    left: x, top: y, width: w, height: h,
                                }}
                            >
                                <div className={cn(
                                    "absolute bg-red-600 rounded-full shadow-[0_0_5px_#ef4444]",
                                    vertical ? "top-0 left-0 right-0 h-3" : "right-0 top-0 bottom-0 w-3"
                                )} />
                            </motion.div>
                        );
                    }

                    if (isMove2Source) {
                        return (
                            <motion.div
                                key={`${index}-${s}-moving-2`}
                                layoutId="moving-stick-2"
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    // Index 1 (0) Bottom (D) to Index 3 (1) Bottom-Right (C)
                                    x: isAnimating ? 304 : 0,
                                    y: isAnimating ? -72 : 0,
                                    rotate: isAnimating ? 90 : 0
                                }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                className={cn(
                                    "absolute rounded-full shadow-[0_0_10px_#22c55e]",
                                    "bg-gradient-to-br from-primary via-primary to-primary/50"
                                )}
                                style={{
                                    left: x, top: y, width: w, height: h,
                                }}
                            >
                                <div className={cn(
                                    "absolute bg-red-600 rounded-full shadow-[0_0_5px_#ef4444]",
                                    vertical ? "top-0 left-0 right-0 h-3" : "right-0 top-0 bottom-0 w-3"
                                )} />
                            </motion.div>
                        );
                    }

                    // Regular Stick
                    return (
                        <div
                            key={`${index}-${s}`}
                            className={cn(
                                "absolute rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                                "bg-primary/80"
                            )}
                            style={{ left: x, top: y, width: w, height: h }}
                        >
                            {/* Match Head */}
                            <div className={cn(
                                "absolute bg-amber-700/80 rounded-full",
                                vertical ? "top-0 left-0 right-0 h-3" : "right-0 top-0 bottom-0 w-3"
                            )} />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full flex-1 min-h-0 flex flex-col items-center gap-6 p-4 overflow-hidden relative">

            {/* Question */}
            <div className="text-center space-y-2 z-10">
                <h3 className="text-lg md:text-xl font-bold text-primary tracking-wide drop-shadow-md">
                    Lv. Tiebreaker
                </h3>
                <p className="text-sm md:text-base text-foreground/90 font-medium">
                    Move 2 matchsticks to make the largest number!
                </p>
            </div>

            {/* Matchstick Display Area */}
            <div className="flex justify-center items-center py-8 z-10 scale-50 md:scale-75 origin-center">
                <DrawDigit digit={3} index={0} />
                <DrawDigit digit={0} index={1} animateMove={true} />
                <DrawDigit digit={8} index={2} />
                {/* Fourth digit position (1) - matchsticks animate here */}
                <div className="relative w-[100px] h-[180px] mx-2">
                    {/* Show the final "1" after animation - B and C segments form "1" */}
                    {isAnimating && (
                        <>
                            {/* Segment B - Top Right (formed by moving stick 1) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.3 }}
                                className="absolute rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)] bg-primary/80"
                                style={{ left: 87, top: 15, width: 8, height: 70 }}
                            >
                                <div className="absolute bg-amber-700/80 rounded-full top-0 left-0 right-0 h-3" />
                            </motion.div>
                            {/* Segment C - Bottom Right (formed by moving stick 2) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.7, duration: 0.3 }}
                                className="absolute rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)] bg-primary/80"
                                style={{ left: 87, top: 95, width: 8, height: 70 }}
                            >
                                <div className="absolute bg-amber-700/80 rounded-full top-0 left-0 right-0 h-3" />
                            </motion.div>
                        </>
                    )}
                    {/* Ghost outline when not animating */}
                    {!isAnimating && (
                        <div className="absolute inset-0 border border-white/5 rounded opacity-10" />
                    )}
                </div>
            </div>

            {/* Input Overlay / Status */}
            <div className="h-12 flex items-center justify-center w-full max-w-xs bg-black/50 border border-primary/30 rounded-lg mb-2">
                <span className="text-2xl font-mono text-primary tracking-[0.5em]">{input}</span>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs z-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleKeypad(num.toString())}
                        className="h-12 rounded-full border border-primary/30 bg-black/40 text-primary font-bold text-xl hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={() => handleKeypad("CLEAR")}
                    className="h-12 rounded-full border border-red-900/50 bg-red-950/30 text-red-500 font-bold text-sm hover:bg-red-900/50 transition-all"
                >
                    Clear
                </button>
                <button
                    onClick={() => handleKeypad("0")}
                    className="h-12 rounded-full border border-primary/30 bg-black/40 text-primary font-bold text-xl hover:bg-primary/20 hover:scale-105 transition-all"
                >
                    0
                </button>
                <button
                    onClick={() => handleKeypad("OK")}
                    className={cn(
                        "h-12 rounded-full border font-bold text-sm transition-all",
                        status === 'success'
                            ? "bg-green-600 border-green-500 text-white shadow-[0_0_15px_#22c55e]"
                            : status === 'error'
                                ? "bg-red-600 border-red-500 text-white"
                                : "bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/40"
                    )}
                >
                    {status === 'success' ? <Check className="w-6 h-6 mx-auto" /> : "OK"}
                </button>
            </div>

            {isAnimating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 z-0 pointer-events-none"
                />
            )}
        </div>
    );
};

export default MatchstickPuzzle;
