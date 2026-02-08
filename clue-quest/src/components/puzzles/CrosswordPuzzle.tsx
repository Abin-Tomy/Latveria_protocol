import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { AnswerInput } from "@/components/AnswerInput";

interface CrosswordPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

// Crossword grid structure
type Cell = {
    letter: string;
    number?: number;
    editable: boolean;
    across?: boolean;
    down?: boolean;
};

export const CrosswordPuzzle = ({ onSolve, level = 9 }: CrosswordPuzzleProps) => {
    // Initialize crossword grid (7x7 grid based on the puzzle)
    const initializeGrid = (): (Cell | null)[][] => {
        const grid: (Cell | null)[][] = Array(7).fill(null).map(() => Array(7).fill(null));

        // Row 0: LIGHT (across)
        grid[0][1] = { letter: 'L', number: 1, editable: true, across: true };
        grid[0][2] = { letter: 'I', editable: true };
        grid[0][3] = { letter: 'G', editable: true };
        grid[0][4] = { letter: 'H', editable: true };
        grid[0][5] = { letter: 'T', editable: true };

        // Row 1: BACK (across) - starts at column 2
        grid[1][2] = { letter: 'B', number: 2, editable: true, across: true };
        grid[1][3] = { letter: 'A', editable: true };
        grid[1][4] = { letter: 'C', editable: true };
        grid[1][5] = { letter: 'K', editable: true };

        // Column 3: THE (down)
        grid[3][3] = { letter: 'T', number: 4, editable: true, down: true };
        grid[4][3] = { letter: 'H', editable: true };
        grid[5][3] = { letter: 'E', editable: true };

        // Column 1: HOME (down)
        grid[3][1] = { letter: 'H', number: 3, editable: true, down: true };
        grid[4][1] = { letter: 'O', editable: true };
        grid[5][1] = { letter: 'M', editable: true };
        grid[6][1] = { letter: 'E', editable: true };

        // Row 6 (last row): WAY (across) - starts at column 4
        grid[6][4] = { letter: 'W', number: 5, editable: true, across: true };
        grid[6][5] = { letter: 'A', editable: true };
        grid[6][6] = { letter: 'Y', editable: true };

        return grid;
    };

    const [grid] = useState<(Cell | null)[][]>(initializeGrid());
    const [userGrid, setUserGrid] = useState<string[][]>(
        Array(7).fill(null).map(() => Array(7).fill(''))
    );
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [finalAnswer, setFinalAnswer] = useState("");
    const [crosswordComplete, setCrosswordComplete] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const answerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (crosswordComplete && answerRef.current) {
            setTimeout(() => {
                answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [crosswordComplete]);

    const clues = [
        { number: 1, text: "I come from the sun or a lamp" },
        { number: 2, text: "Don't Turn your _____ on friends" },
        { number: 3, text: "I'm the place where you live with your family" },
        { number: 4, text: "I'm a tiny word, the most common English word" },
        { number: 5, text: "I'm a path or a road, I show you which direction to go" }
    ];

    const handleCellClick = (row: number, col: number) => {
        if (grid[row][col]?.editable && !crosswordComplete) {
            setSelectedCell({ row, col });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!selectedCell || crosswordComplete) return;

        const { row, col } = selectedCell;
        const key = e.key.toUpperCase();

        if (/^[A-Z]$/.test(key)) {
            const newUserGrid = [...userGrid];
            newUserGrid[row][col] = key;
            setUserGrid(newUserGrid);

            // Move to next cell
            moveToNextCell(row, col);
        } else if (e.key === 'Backspace') {
            const newUserGrid = [...userGrid];
            newUserGrid[row][col] = '';
            setUserGrid(newUserGrid);
        }
    };

    const moveToNextCell = (row: number, col: number) => {
        // Try to move right first
        if (col + 1 < 7 && grid[row][col + 1]?.editable) {
            setSelectedCell({ row, col: col + 1 });
        } else if (row + 1 < 7 && grid[row + 1][col]?.editable) {
            setSelectedCell({ row: row + 1, col });
        }
    };

    const checkCrossword = () => {
        let allCorrect = true;
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                if (grid[row][col]?.editable) {
                    if (userGrid[row][col] !== grid[row][col]?.letter) {
                        allCorrect = false;
                        break;
                    }
                }
            }
            if (!allCorrect) break;
        }

        if (allCorrect) {
            setCrosswordComplete(true);
            setFeedback("");
        } else {
            setFeedback("✗ Some answers are incorrect. Keep trying!");
        }
    };

    const handleFinalSubmit = async (answer: string): Promise<boolean> => {
        const correctAnswer = "LIGHT THE WAY BACK HOME";
        if (answer.toUpperCase().trim() === correctAnswer) {
            setSolved(true);
            setFeedback("TRANSCRIPTION VERIFIED. PATTERN MATCH CONFIRMED.");
            setTimeout(() => {
                onSolve?.(correctAnswer);
            }, 1000);
            return true;
        } else {
            setFeedback("SENTENCE STRUCTURE INVALID. REASSEMBLE THE MEANING.");
            return false;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col overflow-hidden"
            onKeyDown={handleKeyPress}
            tabIndex={0}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg relative z-20">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer 09
                </span>
            </div>

            {/* Question Header */}
            <div className="w-full px-5 py-2 space-y-1 flex flex-col flex-shrink-0 z-20 relative">
                <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                    <span className="text-primary font-bold text-sm">&gt;</span>
                    <span className="text-primary/90 font-semibold">LINGUISTIC DECRYPTION</span>
                </div>
                <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                    <div className="text-foreground flex-shrink-0 text-left space-y-1">
                        <p className="text-xs md:text-sm font-medium tracking-wide">
                            Solve the crossword puzzle clues to reveal the final message.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:pb-20 scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10">
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Clues */}
                        <div className="space-y-4">
                            <div className="border-2 border-primary/30 rounded-lg p-4 bg-card/50">
                                <h3 className="text-xs font-['Press_Start_2P'] text-primary mb-4">CLUES</h3>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
                                    {clues.map((clue) => (
                                        <div key={clue.number} className="text-xs font-['Press_Start_2P'] text-foreground/80">
                                            <span className="text-primary">{clue.number}.</span>
                                            <p className="ml-4 mt-1 text-[10px] leading-relaxed">{clue.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Crossword Grid */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="inline-block border-4 border-primary/50 rounded-lg p-4 bg-black/60">
                                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(7, minmax(0, 1fr))` }}>
                                    {grid.map((row, rowIndex) =>
                                        row.map((cell, colIndex) => (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                                className={`
                                            w-10 h-10 border-2 flex items-center justify-center relative text-lg font-bold
                                            ${cell?.editable
                                                        ? 'bg-black text-primary border-primary/60 cursor-pointer hover:bg-primary/10'
                                                        : 'bg-black border-white/10'
                                                    }
                                            ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                                                        ? 'ring-2 ring-primary shadow-lg shadow-primary/50'
                                                        : ''
                                                    }
                                        `}
                                            >
                                                {cell?.number && (
                                                    <span className="absolute top-0 left-0.5 text-[8px] text-primary font-['Press_Start_2P']">
                                                        {cell.number}
                                                    </span>
                                                )}
                                                {cell?.editable && (
                                                    <span className="font-['Press_Start_2P'] text-sm">
                                                        {userGrid[rowIndex][colIndex]}
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {!crosswordComplete && (
                                <Button
                                    onClick={checkCrossword}
                                    className="mt-4 bg-primary hover:bg-primary/80 text-primary-foreground font-['Press_Start_2P'] px-6 py-2 text-xs"
                                >
                                    Check Answers
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Final Answer Section */}
                    {crosswordComplete && (
                        <div ref={answerRef} className="w-full max-w-2xl mx-auto mt-8 pb-10 px-4">
                            <div className="text-[10px] md:text-sm font-['Press_Start_2P'] text-foreground uppercase text-center mb-6 leading-relaxed">
                                CREATE THE FINAL SENTENCE FROM THE ANSWERS
                            </div>
                            <AnswerInput
                                onSubmit={handleFinalSubmit}
                                successMessage={feedback.includes("VERIFIED") ? feedback : undefined}
                                errorMessage={feedback.includes("INVALID") ? feedback : undefined}
                                placeholder="TYPE THE FINAL MESSAGE..."
                                buttonText="EXECUTE"
                                disabled={solved}
                                withExecuteButton={true}
                                layout="inline"
                            />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
