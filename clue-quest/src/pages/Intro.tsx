import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const storyPanels = [
    {
        text: "Welcome to the world of LOCKSTEP.",
        character: "SYSTEM",
    },
    {
        text: "This world is inhabited by puzzles and mysteries.",
        character: "SYSTEM",
    },
    {
        text: "For some, code is a tool. For others, it's a weapon.",
        character: "SYSTEM",
    },
    {
        text: "We have been waiting for someone with your skills.",
        character: "GUIDE",
    },
    {
        text: "Do you have what it takes to join our ranks?",
        character: "GUIDE",
    }
];

const TypewriterText = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 30); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            onComplete();
        }
    }, [currentIndex, text, onComplete]);

    return <span>{displayedText}</span>;
};

const Intro = () => {
    const navigate = useNavigate();
    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    const currentPanel = storyPanels[currentPanelIndex];

    const handleNext = useCallback(() => {
        if (isTyping) {
            // Could instantly finish typing here if we wanted
            return;
        }

        if (currentPanelIndex < storyPanels.length - 1) {
            setCurrentPanelIndex((prev) => prev + 1);
            setIsTyping(true);
        } else {
            navigate("/team-setup");
        }
    }, [isTyping, currentPanelIndex, navigate]);

    // Allow "Enter" or "Space" to advance
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
                handleNext();
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleNext]);

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 font-['Press_Start_2P'] bg-background transition-colors duration-500 relative overflow-hidden"
            onClick={handleNext}
        >
            {/* Background Ambience (borrowed from Login) */}
            <div className="absolute inset-0 noise opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px"
                }}
            />

            {/* Game Boy Screen Effect Container */}
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-card border-8 border-border rounded-lg shadow-2xl overflow-hidden flex flex-col z-10 glow-primary">

                {/* The "Scene" Area */}
                <div className="flex-1 relative flex items-center justify-center bg-gray-900 border-b-4 border-border overflow-hidden">

                    {/* Scene Background - Custom Image */}
                    <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 hover:scale-105"
                        style={{ backgroundImage: "url('/intro-bg.png')" }}
                    >
                        {/* Overlay for text readability if needed */}
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Character Sprite - Dr Doom */}
                    <AnimatePresence>
                        {currentPanel.character === "GUIDE" && (
                            <motion.img
                                key="doom-constant-sprite"
                                src="/dr-doom-latest.png"
                                alt="Dr Doom"
                                initial={{ opacity: 0, x: 50, y: 100, scale: 1 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: currentPanelIndex === storyPanels.length - 1 ? 150 : 20, // Adjusted Y for better framing with smaller scale
                                    scale: currentPanelIndex === storyPanels.length - 1 ? 2 : 1 // Reduced from 3 to 2
                                }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                className={`absolute bottom-0 ${currentPanelIndex === storyPanels.length - 1 ? "left-1/2 -translate-x-1/2" : "right-10"} w-1/3 max-h-[90%] object-contain drop-shadow-2xl z-20`}
                                style={{
                                    imageRendering: "-webkit-optimize-contrast"
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* System/Other Effects when not Guide */}
                    {currentPanel.character === "SYSTEM" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-primary font-mono text-xl bg-black/80 p-4 border border-primary rounded shadow-[0_0_15px_rgba(0,255,100,0.3)]"
                            >
                                INITIALIZING_LINK...
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* The Dialogue Box Area */}
                <div className="h-1/3 bg-card p-4 relative">
                    {/* Pokemon Style Text Box - Themed */}
                    <div className="w-full h-full bg-background border-4 border-primary/50 rounded-md p-6 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">

                        {/* Character Label */}
                        {currentPanel.character && (
                            <div className="absolute -top-5 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs border-2 border-primary shadow-lg uppercase tracking-widest font-bold">
                                {currentPanel.character}
                            </div>
                        )}

                        <p className="text-foreground text-sm md:text-base leading-relaxed tracking-wider uppercase">
                            <TypewriterText
                                text={currentPanel.text}
                                onComplete={() => setIsTyping(false)}
                            />
                        </p>

                        {/* Blinking Arrow Indicator */}
                        {!isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="absolute bottom-4 right-4 text-primary"
                            >
                                <ChevronDown className="w-6 h-6" />
                            </motion.div>
                        )}

                        {/* Interaction Hint */}
                        <div className="absolute bottom-2 right-12 text-[8px] text-muted-foreground animate-pulse">
                            {isTyping ? "..." : "PRESS SPACE"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-muted-foreground/50 text-xs font-mono">
                LOCKSTEP_OS v2.0.4
            </div>
        </div>
    );
};

export default Intro;
