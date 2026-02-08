import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

interface ThreeDoorsPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

// Shoji Door Component moved outside to prevent re-remounting
const ShojiDoor = ({ index, isOpen, onClick }: { index: number; isOpen: boolean; onClick: () => void }) => {
    return (
        <div
            className="relative cursor-pointer group"
            style={{ perspective: '2000px' }}
            onClick={onClick}
        >
            {/* Door Label */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 font-bold text-sm whitespace-nowrap z-10">
                Door {index + 1}
            </div>

            {/* Door Track/Frame */}
            <div
                className={cn(
                    "w-[140px] h-[280px] md:w-[180px] md:h-[360px] border-4 rounded-lg relative overflow-hidden transition-all duration-300",
                    "bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]",
                    "border-[#5c4033] group-hover:border-[#8b6f47]",
                    "shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] group-hover:shadow-[inset_0_0_40px_rgba(212,175,55,0.3)]"
                )}
            >
                {/* Middle rail */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#5c4033] to-transparent" />

                {/* The actual door panel that swings open */}
                <motion.div
                    className="absolute inset-0 origin-left"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{
                        rotateY: isOpen ? -90 : 0
                    }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Door Panel */}
                    <div
                        className="w-full h-full rounded-lg relative"
                        style={{
                            background: 'linear-gradient(to bottom, #f5e6d3, #e8d5c0)',
                            border: '3px solid #5c4033',
                            boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.4)',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        {/* Inner border */}
                        <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[5%] border border-[#8b6f47] pointer-events-none" />

                        {/* Lattice Grid - Top Half */}
                        <div className="absolute top-[8%] left-[8%] right-[8%] h-[40%] grid grid-cols-4 grid-rows-5 gap-[2px]">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={`top-${i}`}
                                    className="bg-white/50 border border-[#8b6f47] relative"
                                >
                                    <div className="absolute w-[1px] h-full left-1/2 top-0 bg-[#8b6f47]" />
                                    <div className="absolute w-full h-[1px] left-0 top-1/2 bg-[#8b6f47]" />
                                </div>
                            ))}
                        </div>

                        {/* Lattice Grid - Bottom Half */}
                        <div className="absolute bottom-[8%] left-[8%] right-[8%] h-[40%] grid grid-cols-4 grid-rows-5 gap-[2px]">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={`bottom-${i}`}
                                    className="bg-white/50 border border-[#8b6f47] relative"
                                >
                                    <div className="absolute w-[1px] h-full left-1/2 top-0 bg-[#8b6f47]" />
                                    <div className="absolute w-full h-[1px] left-0 top-1/2 bg-[#8b6f47]" />
                                </div>
                            ))}
                        </div>

                        {/* Door Handle */}
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-12 rounded-md"
                            style={{
                                background: 'linear-gradient(to right, #2a2a2a, #4a4a4a, #2a2a2a)',
                                boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)'
                            }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1a1a1a] rounded-full" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const ThreeDoorsPuzzle = ({ onSolve, level = 11 }: ThreeDoorsPuzzleProps) => {
    const [doorStates, setDoorStates] = useState<[number, number, number]>([0, 0, 0]);
    const [firstDoorIndex, setFirstDoorIndex] = useState<number | null>(null);
    const [binaryCounter, setBinaryCounter] = useState(0);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [status, setStatus] = useState("Click any door to start binary counting...");
    const [statusType, setStatusType] = useState<"" | "success" | "error">("");
    // Hint removed to be moved to Intel section
    const [showSequenceHint, setShowSequenceHint] = useState(false);

    // Timer logic in Game.tsx handles external hints now

    // Sequence info for each door
    const sequenceInfo: { [key: number]: string } = {
        0: 'Door 1 sequence: 000→100→001→101→010→110→011→111',
        1: 'Door 2 sequence: 000→010→100→110→001→011→101→111',
        2: 'Door 3 sequence: 000→001→010→011→100→101→110→111'
    };

    // Winning patterns based on which door was clicked first
    const winningPatterns: { [key: number]: [number, number, number] } = {
        0: [1, 0, 1],  // Door 1 first: 101
        1: [1, 1, 0],  // Door 2 first: 110
        2: [0, 1, 1]   // Door 3 first: 011
    };

    const isWinningState = (): boolean => {
        if (firstDoorIndex === null) return false;
        const target = winningPatterns[firstDoorIndex];
        return doorStates[0] === target[0] &&
            doorStates[1] === target[1] &&
            doorStates[2] === target[2];
    };

    const getWinningPattern = (): string => {
        if (firstDoorIndex === null) return "???";
        return winningPatterns[firstDoorIndex].join('');
    };

    const updateDoorsFromBinary = (counter: number, firstDoor: number): [number, number, number] => {
        // Convert binary counter to 3-bit representation
        const bit0 = (counter >> 0) & 1; // Least significant bit
        const bit1 = (counter >> 1) & 1; // Middle bit
        const bit2 = (counter >> 2) & 1; // Most significant bit

        let newStates: [number, number, number] = [0, 0, 0];

        if (firstDoor === 0) {
            // Door 1 clicked first: 000,100,001,101,010,110,011,111
            // Door1=bit0, Door3=bit1, Door2=bit2
            newStates[0] = bit0;  // Door 1
            newStates[1] = bit2;  // Door 2
            newStates[2] = bit1;  // Door 3
        } else if (firstDoor === 1) {
            // Door 2 clicked first: 000,010,100,110,001,011,101,111
            // Door2=bit0, Door1=bit1, Door3=bit2
            newStates[0] = bit1;  // Door 1
            newStates[1] = bit0;  // Door 2
            newStates[2] = bit2;  // Door 3
        } else if (firstDoor === 2) {
            // Door 3 clicked first (normal binary): 000,001,010,011,100,101,110,111
            // Door3=bit0, Door2=bit1, Door1=bit2
            newStates[0] = bit2;  // Door 1
            newStates[1] = bit1;  // Door 2
            newStates[2] = bit0;  // Door 3
        }

        return newStates;
    };

    const handleDoorClick = (doorIndex: number) => {
        if (puzzleSolved) return;

        if (!gameStarted) {
            // First click - start the sequence at step 1
            setFirstDoorIndex(doorIndex);
            setGameStarted(true);
            const newCounter = 1;
            setBinaryCounter(newCounter);

            const newStates = updateDoorsFromBinary(newCounter, doorIndex);
            setDoorStates(newStates);

            const binaryString = newStates.join('');
            // Status update removed as requested
            // setStatus(`Current: ${binaryString} (step ${newCounter})`);
            return;
        }

        // Subsequent clicks - advance the counter
        const newCounter = binaryCounter + 1;

        // If counter exceeds 7 (111 reached), reset everything and let player choose new door
        if (newCounter > 7) {
            setDoorStates([0, 0, 0]);
            setBinaryCounter(0);
            setFirstDoorIndex(null);
            setGameStarted(false);
            setStatus("Click any door to start binary counting...");
            setStatusType('');
            return;
        }

        setBinaryCounter(newCounter);
        const newStates = updateDoorsFromBinary(newCounter, firstDoorIndex!);
        setDoorStates(newStates);

        const binaryString = newStates.join('');

        // Update status without revealing the winning state
        // setStatus(`Current: ${binaryString} (step ${newCounter})`);
        setStatusType('');
    };

    const handleProceed = () => {
        if (puzzleSolved) return;

        // Check if current state matches any of the winning patterns
        const currentState = doorStates.join('');
        const validPatterns = ['101', '110', '011'];

        if (validPatterns.includes(currentState)) {
            setPuzzleSolved(true);
            setStatus('✓ CORRECT');
            setStatusType('success');

            setTimeout(() => {
                onSolve?.('BINARY');
            }, 1000);
        }
    };

    const resetPuzzle = () => {
        setPuzzleSolved(false);
        setDoorStates([0, 0, 0]);
        setFirstDoorIndex(null);
        setBinaryCounter(0);
        setGameStarted(false);
        setStatus("Click any door to start binary counting...");
        setStatusType('');
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
            <div className="px-3 py-2 space-y-1 flex flex-col flex-1 min-h-0 overflow-y-auto w-full"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                }}
            >
                {/* Question Header */}
                <div className="space-y-1 flex flex-col flex-shrink-0">
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">&gt;</span>
                        <span className="text-primary/90 font-semibold">BINARY SEQUENCE</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10 flex-shrink-0">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">
                                Three doors stand before you. Each click advances the binary sequence. Choose your first door wisely—it determines your path to 111. Eight precise clicks will unlock the passage.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4 relative w-full">
                    {/* Puzzle Frame */}
                    <div
                        className="relative p-4 md:p-8 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#8b4513]/30"
                        style={{
                            background: 'linear-gradient(to bottom, #2a1810, #1a0f08)',
                        }}
                    >
                        {/* Frame border */}
                        <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-[#8b4513] rounded-xl pointer-events-none z-0 opacity-50" />

                        {/* Three Doors */}
                        <div className="flex gap-4 md:gap-8 justify-center items-center relative z-10 mb-6 mt-12 scale-90 md:scale-100">
                            <ShojiDoor index={0} isOpen={doorStates[0] === 1} onClick={() => handleDoorClick(0)} />
                            <ShojiDoor index={1} isOpen={doorStates[1] === 1} onClick={() => handleDoorClick(1)} />
                            <ShojiDoor index={2} isOpen={doorStates[2] === 1} onClick={() => handleDoorClick(2)} />
                        </div>

                        {/* Status Text inside card to keep it self-contained */}
                        <div className="relative z-10 text-center space-y-2 mt-4 max-w-lg mx-auto bg-black/40 p-3 rounded-lg border border-[#8b4513]/30 backdrop-blur-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className={cn(
                                        "text-xs md:text-sm font-mono tracking-wide",
                                        statusType === 'success' ? "text-green-400 font-bold" :
                                            statusType === 'error' ? "text-red-400" :
                                                "text-[#d4af37]"
                                    )}
                                >
                                    {status}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-black/80 border-t border-[#8b4513]/30 p-4 z-20 backdrop-blur-md flex justify-center gap-4">
                <button
                    onClick={resetPuzzle}
                    className="px-6 py-2 rounded-lg font-bold text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                    RESET
                </button>
                <button
                    onClick={handleProceed}
                    disabled={puzzleSolved}
                    className={cn(
                        "px-8 py-2 rounded-lg font-bold text-xs transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]",
                        "bg-green-600 text-white hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]",
                        puzzleSolved && "opacity-50 cursor-not-allowed bg-green-500 text-white shadow-none hover:bg-green-500 hover:shadow-none border-none"
                    )}
                >
                    {puzzleSolved ? 'UNLOCKED' : 'PROCEED'}
                </button>
            </div>
        </div>
    );
};

export default ThreeDoorsPuzzle;
