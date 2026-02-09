import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { AnswerInput } from "@/components/AnswerInput";

interface URLPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

export const URLPuzzle = ({ onSolve, level = 2 }: URLPuzzleProps) => {
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string[]>([]);

    // Generate random text noise
    const generateRandomText = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
        let text = "";
        for (let i = 0; i < 800; i++) {
            text += chars[Math.floor(Math.random() * chars.length)];
            if (i % 60 === 0) text += "\n";
        }
        return text;
    };

    const randomNoise = generateRandomText();

    // Generate random codes for image display
    const generateRandomCodes = (includeSecret: boolean = false) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
        const lines: string[] = [];

        // Generate random code lines (reduced to fit screen without scrolling)
        for (let i = 0; i < 12; i++) {
            let line = "";
            const lineLength = Math.floor(Math.random() * 40) + 35;
            for (let j = 0; j < lineLength; j++) {
                line += chars[Math.floor(Math.random() * chars.length)];
            }
            lines.push(line);
        }

        // Insert the secret in the middle for the correct URL
        if (includeSecret) {
            const middleIndex = Math.floor(lines.length / 2);
            const insertPosition = Math.floor(lines[middleIndex].length / 2);
            lines[middleIndex] =
                lines[middleIndex].substring(0, insertPosition) +
                "<escape→UNSEAL>" +
                lines[middleIndex].substring(insertPosition + 15);
        }

        return lines;
    };

    const handleUrlClick = (url: string) => {
        const isCorrectUrl = url === "http://site.com/escape/path";
        setSelectedUrl(url);
        setImageData(generateRandomCodes(isCorrectUrl));
    };

    const closeModal = () => {
        setSelectedUrl(null);
        setImageData([]);
    };

    // URLs to display (one contains 'escape')
    const urls = [
        "http://site.com/escape/path",
        "http://data.net/files/log",
        "http://server.org/api/run",
        "http://media.io/load/file",
    ];

    // Code blocks (one contains 'escape')
    const codeBlocks = [
        "kilje12569mq",
        "nce354we56",
        "xyz789abc",
        "escape123def",
        "ghi456jkl",
    ];

    const handleSolve = async (submission: string): Promise<boolean> => {
        if (submission.toUpperCase().trim() === "UNSEAL") {
            setSolved(true);
            setFeedback("ESCAPE PROTOCOL VALIDATED.\nLAYER 02 BREACHED.");
            setTimeout(() => {
                onSolve?.("UNSEAL");
            }, 1000);
            return true;
        } else {
            setFeedback("INVALID COMPARISON.\nREASSESS ALL FRAGMENTS.");
            return false;
        }
    };

    return (
        <div className="w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg relative">
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
                        <span className="text-primary/90 font-semibold">URL FRAGMENT ANALYSIS</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">THE WRONG URL COLLAPSES.</p>
                            <p className="text-xs md:text-sm font-medium tracking-wide">THE CORRECT ONE ESCAPES</p>
                        </div>
                    </div>
                </div>

                {/* Noisy Background with URLs */}
                <div className="relative bg-black/80 border-2 border-primary/30 rounded-lg p-6 overflow-y-auto custom-scrollbar mt-3 max-h-[500px]">
                    {/* Random text background */}
                    <div className="absolute inset-0 overflow-hidden opacity-20 font-mono text-[8px] leading-tight text-green-500 pointer-events-none">
                        {randomNoise}
                    </div>

                    {/* Glitch overlay images */}
                    <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-blue-500 blur-md"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                        <div className="w-full h-full bg-gradient-to-tl from-yellow-500 to-purple-500 blur-md"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 opacity-10">
                        <div className="w-full h-full bg-gradient-to-r from-green-500 to-pink-500 blur-md"></div>
                    </div>

                    {/* URLs scattered in the noise */}
                    <div className="relative z-10 space-y-8">
                        <div className="text-center">
                            <p className="text-red-400 font-['Press_Start_2P'] text-xs mb-4 animate-pulse">
                                ⚠️ INTERFERENCE DETECTED ⚠️
                            </p>
                        </div>

                        {/* URL fragments scattered */}
                        <div className="grid grid-cols-2 gap-4">
                            {urls.map((url, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleUrlClick(url)}
                                    initial={{ opacity: 0, x: Math.random() * 40 - 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className={`font-mono text-xs p-2 rounded border cursor-pointer hover:scale-105 transition-transform ${url.includes("escape-")
                                        ? "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                        : "border-primary/30 bg-primary/5 text-primary/60 hover:bg-primary/10"
                                        }`}
                                >
                                    {url}
                                </motion.button>
                            ))}
                        </div>

                        <div className="border-t border-primary/20 pt-6">
                            <p className="text-yellow-400 font-['Press_Start_2P'] text-[10px] mb-4">
                                CODE FRAGMENTS INTERCEPTED:
                            </p>

                            {/* Code blocks */}
                            <div className="grid grid-cols-3 gap-3">
                                {codeBlocks.map((code, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        className={`font-mono text-xs p-3 rounded border text-center ${code.includes("escape")
                                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 font-bold"
                                            : "border-muted/30 bg-muted/10 text-muted-foreground"
                                            }`}
                                    >
                                        {code}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Answer Input */}
                <div className="space-y-4 mt-auto p-4 z-20 relative">
                    <AnswerInput
                        onSubmit={handleSolve}
                        errorMessage={feedback}
                        withExecuteButton
                    />
                </div>

                {/* Image Modal */}
                <AnimatePresence>
                    {selectedUrl && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                            onClick={closeModal}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-black border-4 border-primary rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-['Press_Start_2P'] text-sm text-primary">
                                        URL: {selectedUrl}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-primary hover:text-primary/70 text-2xl font-bold"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Random codes display */}
                                <div className="bg-black/50 border-2 border-primary/30 rounded p-6">
                                    <div className="space-y-2 font-mono text-[10px] text-green-400 leading-tight break-all">
                                        {imageData.map((line, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                            >
                                                {line}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={closeModal}
                                        className="bg-primary text-black px-6 py-2 rounded font-['Press_Start_2P'] text-xs hover:bg-primary/90"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
