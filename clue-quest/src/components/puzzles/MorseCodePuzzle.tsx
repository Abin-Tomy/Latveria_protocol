import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal, Lightbulb } from "lucide-react";
import { AnswerInput } from "@/components/AnswerInput";

interface MorseCodePuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

export const MorseCodePuzzle = ({ onSolve, level = 3 }: MorseCodePuzzleProps) => {
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [showUnscrambleHint, setShowUnscrambleHint] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Morse code for MANIPULATION (only codes, no letters shown)
    const manipulationMorse = ["−−", "•−", "−•", "••", "•−−•", "••−", "•−••", "•−", "−", "••", "−−−", "−•"];

    const handleSolve = async (answer: string): Promise<boolean | { success: boolean; status?: "success" | "error" | "warning"; message?: string; keepInput?: boolean }> => {
        const normalizedAnswer = answer.toUpperCase().trim();

        // If they enter "MANIPULATION" - show the unscramble hint
        if (normalizedAnswer === "MANIPULATION") {
            setShowUnscrambleHint(true);
            return {
                success: false,
                status: 'warning',
                message: "🔍 UNSCRAMBLE AND FIND THE WORD WITHIN",
                keepInput: true
            };
        }

        // Correct answer is "PLAN"
        if (normalizedAnswer === "PLAN") {
            setSolved(true);
            setFeedback("SIGNAL UNDERSTOOD.\nMEANING CONFIRMED.\nLAYER 03 BREACHED.");
            setTimeout(() => {
                onSolve?.("PLAN");
            }, 1000);
            return true;
        } else {
            setFeedback("SIGNAL MISREAD.\nREASSESS THE PATTERN.");
            return false;
        }
    };

    return (
        <div className="w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-1 flex flex-col flex-1 min-h-0 overflow-y-auto w-full">
                {/* Question Header */}
                <div className="space-y-1 flex flex-col">
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">&gt;</span>
                        <span className="text-primary/90 font-semibold">SIGNAL INTERPRETATION CHALLENGE</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">NOT ALL MESSAGES ARE MEANT TO BE READ. SOME ARE MEANT TO BE INTERPRETED.</p>
                            <p className="text-xs md:text-sm font-medium tracking-wide">READ THE SIGNAL. IGNORE THE NOISE.</p>
                        </div>
                    </div>
                </div>

                {/* Morse Code Display */}
                <div className="border-4 border-primary/50 rounded-lg p-6 bg-black/60 space-y-4 mt-3">
                    <h3 className="text-xs font-['Press_Start_2P'] text-primary text-center mb-2">
                        MORSE CODE MESSAGE
                    </h3>
                    <p className="text-[10px] text-gray-400 text-center mb-4">
                        Read the Dots and Dashes
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        {manipulationMorse.map((code, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center p-3 bg-primary/10 border-2 border-primary/40 rounded-lg min-w-[60px]"
                            >
                                <span className="font-['Press_Start_2P'] text-2xl text-primary">
                                    {code}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hint Box - After morse code */}
                <div className="space-y-2">
                    <Button
                        onClick={() => setShowHint(!showHint)}
                        variant="outline"
                        className="w-full border-2 border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary font-['Press_Start_2P'] text-xs py-3 flex items-center justify-center gap-2"
                    >
                        <Lightbulb className="w-4 h-4" />
                        {showHint ? "HIDE HINT" : "NEED A HINT?"}
                    </Button>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-2 border-green-500/50 rounded-lg p-4 bg-green-500/10"
                        >
                            <p className="text-xs font-['Press_Start_2P'] text-green-400 text-center leading-relaxed">
                                Hop to the word given and escape key is a word in it
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Answer Input Box - Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mt-auto"
                >
                    <AnswerInput
                        onSubmit={handleSolve}
                        successMessage={"SIGNAL UNDERSTOOD.\nMEANING CONFIRMED.\nLAYER 03 BREACHED."}
                        errorMessage={feedback}
                        withExecuteButton
                        feedbackPlacement="top"
                        disabled={solved}
                    />
                </motion.div>

            </div>
        </div>
    );
};
