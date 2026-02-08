import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle, XCircle } from "lucide-react";

interface AvengersPuzzleProps {
    onSolve?: (answer: string) => void;
}

const statements = [
    {
        id: 1,
        text: "A boy steps into metal, survives ice, waits decades, and finds a museum that never existed when he left.",
        answer: "Captain America"
    },
    {
        id: 2,
        text: "Exiled royalty learns humility when strength fails, walks on a blue planet full of people unaware, then regains what was lost.",
        answer: "Thor"
    },
    {
        id: 3,
        text: "An experiment splits a man, his anger shakes cities, and the world prefers him invisible.",
        answer: "Hulk"
    },
    {
        id: 4,
        text: "A prisoner creates armor to escape, fires tools from his wrists, and teaches a lesson in unintended fame.",
        answer: "Iron Man"
    },
    {
        id: 5,
        text: "A warrior loses their past, finds power in a sky that isn't home, and fights the enemy even without a planet.",
        answer: "Captain Marvel"
    }
];

// Correct timeline order: Captain America (1), Captain Marvel (5), Iron Man (4), Thor (2), Hulk (3)
const correctTimelineOrder = "15423";

export const AvengersPuzzle = ({ onSolve }: AvengersPuzzleProps) => {
    const [timelineInput, setTimelineInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);

    const handleSubmit = () => {
        const answer = timelineInput.replace(/\s/g, '').trim();
        
        if (answer === correctTimelineOrder) {
            setSolved(true);
            setFeedback("✓ CORRECT! You've mastered the MCU timeline!");
            setTimeout(() => {
                onSolve?.(correctTimelineOrder);
            }, 1500);
        } else {
            setFeedback("✗ Incorrect timeline order. Identify each Avenger first, then arrange by movie release/timeline order.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col p-4 overflow-hidden"
        >
            {/* Header */}
            <div className="text-center mb-4 flex-shrink-0">
                <h2 className="text-sm md:text-base font-['Press_Start_2P'] text-primary mb-2">
                    AVENGERS TIMELINE
                </h2>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
                    Identify the Avenger in each statement and arrange their movies in the correct timeline order.
                </p>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
                {/* Statements */}
                {statements.map((statement, index) => (
                    <motion.div
                        key={statement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-2 border-primary/30 rounded-lg p-3 bg-black/40"
                    >
                        <div className="flex gap-3">
                            <span className="text-primary font-bold text-sm flex-shrink-0">
                                {statement.id}.
                            </span>
                            <p className="text-[10px] md:text-xs text-foreground leading-relaxed">
                                {statement.text}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Answer Input - Fixed at bottom */}
            {!solved && (
                <div className="flex-shrink-0 pt-4 space-y-3 border-t border-primary/20 mt-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Info className="w-3 h-3" />
                        <span>Enter the timeline order using numbers (e.g., 12345)</span>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={timelineInput}
                            onChange={(e) => {
                                // Only allow numbers
                                const val = e.target.value.replace(/[^1-5]/g, '').slice(0, 5);
                                setTimelineInput(val);
                                setFeedback("");
                            }}
                            placeholder="Enter timeline order..."
                            maxLength={5}
                            className="flex-1 px-4 py-2 bg-black border-2 border-primary/50 rounded text-foreground font-['Press_Start_2P'] text-sm uppercase tracking-widest focus:outline-none focus:border-primary"
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={timelineInput.length !== 5}
                            className="bg-primary hover:bg-primary/80 text-black font-bold px-6 text-xs uppercase"
                        >
                            EXECUTE
                        </Button>
                    </div>
                </div>
            )}

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex-shrink-0 mt-3 flex items-center justify-center gap-2 p-3 rounded-lg text-[10px] font-bold ${
                        feedback.includes("✓")
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : "bg-red-500/20 text-red-400 border border-red-500/50"
                    }`}
                >
                    {feedback.includes("✓") ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <XCircle className="w-4 h-4" />
                    )}
                    {feedback}
                </motion.div>
            )}

            {/* Success State */}
            {solved && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-shrink-0 mt-4 p-4 bg-primary/20 border-2 border-primary rounded-lg text-center"
                >
                    <p className="text-primary text-xs font-bold mb-2">TIMELINE DECRYPTED</p>
                    <p className="text-[10px] text-muted-foreground">
                        Captain America → Captain Marvel → Iron Man → Thor → Hulk
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AvengersPuzzle;
