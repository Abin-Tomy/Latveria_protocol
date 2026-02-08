import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface ConsequencePuzzleProps {
    onSolve?: (answer: string) => void;
    onWrongAnswer?: () => void;
    level?: number;
}

export const ConsequencePuzzle = ({ onSolve, onWrongAnswer, level = 14 }: ConsequencePuzzleProps) => {
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [typedText1, setTypedText1] = useState("");
    const [typedText2, setTypedText2] = useState("");
    const [typedText3, setTypedText3] = useState("");
    const [typedText4, setTypedText4] = useState("");

    const text1 = "Every decision you make leaves a mark in time.";
    const text2 = "Some moments are more important than others.";
    const text3 = "When did your journey through this maze truly begin?";
    const text4 = "What time was on the clock when fate first called?";

    useEffect(() => {
        // Typing animation for text 1
        let index1 = 0;
        const timer1 = setInterval(() => {
            if (index1 <= text1.length) {
                setTypedText1(text1.slice(0, index1));
                index1++;
            } else {
                clearInterval(timer1);
            }
        }, 30);

        // Typing animation for text 2 (starts after text 1)
        let timer2: NodeJS.Timeout;
        const delay2 = setTimeout(() => {
            let index2 = 0;
            timer2 = setInterval(() => {
                if (index2 <= text2.length) {
                    setTypedText2(text2.slice(0, index2));
                    index2++;
                } else {
                    clearInterval(timer2);
                }
            }, 30);
        }, text1.length * 30 + 300);

        // Typing animation for text 3
        let timer3: NodeJS.Timeout;
        const delay3 = setTimeout(() => {
            let index3 = 0;
            timer3 = setInterval(() => {
                if (index3 <= text3.length) {
                    setTypedText3(text3.slice(0, index3));
                    index3++;
                } else {
                    clearInterval(timer3);
                }
            }, 30);
        }, (text1.length + text2.length) * 30 + 600);

        // Typing animation for text 4
        let timer4: NodeJS.Timeout;
        const delay4 = setTimeout(() => {
            let index4 = 0;
            timer4 = setInterval(() => {
                if (index4 <= text4.length) {
                    setTypedText4(text4.slice(0, index4));
                    index4++;
                } else {
                    clearInterval(timer4);
                }
            }, 30);
        }, (text1.length + text2.length + text3.length) * 30 + 900);

        return () => {
            clearInterval(timer1);
            if (timer2) clearInterval(timer2);
            if (timer3) clearInterval(timer3);
            if (timer4) clearInterval(timer4);
            clearTimeout(delay2);
            clearTimeout(delay3);
            clearTimeout(delay4);
        };
    }, [text1, text2, text3, text4]);

    const handleExecute = () => {
        if (!hours || !minutes) {
            setFeedback("Please enter both hours and minutes");
            return;
        }

        // Format the time as HH:MM
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

        // Check if the answer is correct (12:15)
        if (formattedTime === "12:15") {
            if (onSolve) {
                onSolve(formattedTime);
                setSolved(true);
            }
        } else {
            // Wrong answer - trigger penalty (reset to Level 1)
            setFeedback("CHOICES HAVE CONSEQUENCES: Wrong input. As a penalty, you will go back to the first layer.");
            setTimeout(() => {
                if (onWrongAnswer) {
                    onWrongAnswer();
                }
            }, 5000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleExecute();
        }
    };

    // Text animation variants
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.3,
                duration: 0.8
            }
        })
    };

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg relative z-20">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer 14
                </span>
            </div>

            {/* Question Header */}
            <div className="w-full px-3 py-2 space-y-1 flex flex-col flex-shrink-0 z-20 relative">
                <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                    <span className="text-primary font-bold text-sm">&gt;</span>
                    <span className="text-primary/90 font-semibold">CONSEQUENCES OF TIME</span>
                </div>
                <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                    <div className="text-foreground flex-shrink-0 text-left space-y-1">
                        <p className="text-xs md:text-sm font-medium tracking-wide">
                            CHOICES HAVE CONSEQUENCES
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content area with background */}
            <div className="flex-1 relative flex items-end justify-center overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("/14th%20-level.png")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        filter: 'brightness(0.6)'
                    }}
                />

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content container at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 w-full max-w-2xl mb-2 px-4 pb-2"
                >
                    {/* Animated Text */}
                    <motion.div className="text-center mb-3 space-y-0.5">

                        <motion.p
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={textVariants}
                            className="text-[10px] md:text-xs text-gray-200 min-h-[16px]"
                        >
                            {typedText1}
                            {typedText1.length < text1.length && <span className="animate-pulse">|</span>}
                        </motion.p>

                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={textVariants}
                            className="text-[10px] md:text-xs text-gray-200 min-h-[16px]"
                        >
                            {typedText2}
                            {typedText2.length > 0 && typedText2.length < text2.length && <span className="animate-pulse">|</span>}
                        </motion.p>

                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={textVariants}
                            className="space-y-0 pt-1"
                        >
                            <p className="text-[10px] md:text-xs text-gray-300 min-h-[16px]">
                                {typedText3}
                                {typedText3.length > 0 && typedText3.length < text3.length && <span className="animate-pulse">|</span>}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-300 min-h-[16px]">
                                {typedText4}
                                {typedText4.length > 0 && typedText4.length < text4.length && <span className="animate-pulse">|</span>}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Input Section */}
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        className="flex flex-col items-center gap-2"
                    >
                        {/* Time Input Boxes */}
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex flex-col items-center">
                                <label className="text-gray-300 text-[9px] mb-0.5 uppercase tracking-wider">
                                    Hours
                                </label>
                                <input
                                    type="text"
                                    value={hours}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 2 && (val === '' || parseInt(val) <= 23)) {
                                            setHours(val);
                                        }
                                    }}
                                    onKeyPress={handleKeyPress}
                                    maxLength={2}
                                    className="w-11 h-11 text-center text-lg font-bold bg-black/70 border-2 border-primary/50 rounded text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                                    disabled={solved}
                                />
                            </div>

                            <div className="text-xl text-primary font-bold mt-4">:</div>

                            <div className="flex flex-col items-center">
                                <label className="text-gray-300 text-[9px] mb-0.5 uppercase tracking-wider">
                                    Minutes
                                </label>
                                <input
                                    type="text"
                                    value={minutes}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 2 && (val === '' || parseInt(val) <= 59)) {
                                            setMinutes(val);
                                        }
                                    }}
                                    onKeyPress={handleKeyPress}
                                    maxLength={2}
                                    className="w-11 h-11 text-center text-lg font-bold bg-black/70 border-2 border-primary/50 rounded text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                                    disabled={solved}
                                />
                            </div>
                        </div>

                        {/* Execute Button */}
                        <motion.button
                            onClick={handleExecute}
                            disabled={solved || !hours || !minutes}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary/20 hover:bg-primary/30 border-2 border-primary text-primary rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                        >
                            Execute
                        </motion.button>

                        {/* Feedback Message */}
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs md:text-sm mt-2 text-center max-w-md px-4 py-2 bg-red-900/20 border border-red-500/30 rounded backdrop-blur-sm"
                            >
                                {feedback}
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
