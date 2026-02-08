import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { Lock, Terminal } from "lucide-react";

interface RotaryDialPuzzleProps {
    onSolve?: (answer: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const TARGET_WORD = "ESCAPE";
const NEXT_WORD = "SYSTEM";
const FACE_COUNT = 26;
const ANGLE_PER_FACE = 360 / FACE_COUNT;
const FACE_HEIGHT = 50;
const FACE_WIDTH = 80;
// Radius calculation:
// Circumference = 2 * PI * R
// C = FACE_WIDTH * FACE_COUNT? No, we arrange them in a circle.
// If we form a regular polygon with N sides of length W:
// R = (W / 2) / tan(PI / N)
const RADIUS = (FACE_WIDTH / 2) / Math.tan(Math.PI / FACE_COUNT);
// Approx 330px for 80px width.

// Helper to generate the ring for a specific wheel index
const generateRing = (wheelIndex: number): string[] => {
    const targetChar = TARGET_WORD[wheelIndex];
    const nextChar = NEXT_WORD[wheelIndex];

    // Create the base alphabet without the special chars
    const availableChars = ALPHABET.filter(c => c !== targetChar && c !== nextChar);

    // Construct the ring
    // Index 0: Target Character (ESCAPE)
    // Index 1: Next Character (SYSTEM)
    const ring = new Array(26).fill('');
    ring[0] = targetChar;
    ring[1] = nextChar;

    // Fill the rest
    for (let i = 0; i < 24; i++) {
        ring[i + 2] = availableChars[i];
    }

    return ring;
};

// Generate all 6 rings
const WHEEL_RINGS = Array.from({ length: 6 }, (_, i) => generateRing(i));

export const RotaryDialPuzzle = ({ onSolve }: RotaryDialPuzzleProps) => {
    const [wheelIndices, setWheelIndices] = useState<number[]>([0, 0, 0, 0, 0, 0]);
    const [isSolved, setIsSolved] = useState(false);

    // Initial random scrambling
    useEffect(() => {
        setWheelIndices([
            Math.floor(Math.random() * 26),
            Math.floor(Math.random() * 26),
            Math.floor(Math.random() * 26),
            Math.floor(Math.random() * 26),
            Math.floor(Math.random() * 26),
            Math.floor(Math.random() * 26)
        ]);
    }, []);

    const checkSolution = (indices: number[]) => {
        // Check if the current visible character on each wheel matches the target word
        // Note: Using WHEEL_RINGS[wheelIdx][idx]
        const currentWord = indices.map((idx, wheelIdx) => WHEEL_RINGS[wheelIdx][idx]).join("");

        if (currentWord === TARGET_WORD) {
            setIsSolved(true);
            if (onSolve) {
                setTimeout(() => onSolve(TARGET_WORD), 2000);
            }
        }
    };

    const handleWheelChange = (wheelIndex: number, newIndex: number) => {
        // Normalize index to 0-25
        const normalizedIndex = ((newIndex % 26) + 26) % 26;

        setWheelIndices(prev => {
            const next = [...prev];
            next[wheelIndex] = normalizedIndex;
            return next;
        });

        // Check immediately
        const nextIndices = [...wheelIndices];
        nextIndices[wheelIndex] = normalizedIndex;
        checkSolution(nextIndices);
    };

    return (
        <div className={`relative w-full h-full flex flex-col overflow-hidden transition-colors duration-2000 perspective-1000 ${isSolved ? 'bg-black' : 'bg-transparent'}`}>

            {/* Background Effect for Solved State */}
            {isSolved && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-0 bg-black flex items-center justify-center"
                >
                    <div className="text-secondary text-5xl md:text-6xl font-black tracking-[0.2em] md:tracking-[0.5em] animate-pulse text-center leading-tight flex flex-col items-center gap-6">
                        <div>ESCAPE</div>
                        <div>THE</div>
                        <div>SYSTEM</div>
                    </div>
                </motion.div>
            )}

            {/* Header */}
            <div className={`relative z-10 w-full bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg ${isSolved ? 'opacity-0 pointer-events-none transition-opacity duration-1000' : ''}`}>
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer 15
                </span>
            </div>

            <div className={`relative z-10 flex flex-col flex-1 min-h-0 items-center gap-8 p-4 overflow-y-auto ${isSolved ? 'opacity-0 pointer-events-none transition-opacity duration-1000' : ''}`}>

                <div className="w-full space-y-4 flex flex-col items-center flex-shrink-0">
                    {/* Question Header */}
                    <div className="w-full space-y-1 flex flex-col">
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                            <span className="text-primary font-bold text-sm">&gt;</span>
                            <span className="text-primary/90 font-semibold">ROTARY ENCRYPTION</span>
                        </div>

                        <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                            <div className="text-foreground flex-shrink-0 text-left space-y-1">
                                <p className="text-xs md:text-sm font-medium tracking-wide">
                                    The vault mechanism is controlled by a 6-cylinder lock. Align the tumblers to form the keyword that grants freedom.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Perspective Container for 3D Wheels */}
                {/* Main Housing Bezel */}
                <div className="relative p-6 bg-gradient-to-b from-gray-900 to-black rounded-lg border border-gray-800 shadow-2xl before:absolute before:inset-0 before:rounded-lg before:border before:border-white/5 before:pointer-events-none flex-shrink-0">

                    {/* Metallic Screws */}
                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-700 shadow-inner" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-700 shadow-inner" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-700 shadow-inner" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-700 shadow-inner" />

                    <div className="relative flex flex-col gap-3 perspective-1000" style={{ transformStyle: 'preserve-3d' }}>

                        {/* Center Highlight / Glass Lens */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100px] z-50 pointer-events-none">
                            {/* Glass Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-x border-primary/30 rounded-sm backdrop-blur-[1px]" />
                            {/* Laser Line */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-primary/50 shadow-[0_0_10px_#22c55e]" />
                        </div>

                        {wheelIndices.map((currentIndex, wheelIdx) => (
                            <Wheel3D
                                key={wheelIdx}
                                index={currentIndex}
                                chars={WHEEL_RINGS[wheelIdx]}
                                onChange={(idx) => handleWheelChange(wheelIdx, idx)}
                                isLocked={isSolved}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-[9px] text-primary/40 font-mono tracking-widest uppercase flex-shrink-0 pb-4">
                    &lt; DRAG WHEELS TO ALIGN &gt;
                </div>
            </div>
        </div>
    );
};

interface WheelProps {
    index: number;
    chars: string[];
    onChange: (newIndex: number) => void;
    isLocked: boolean;
}

const Wheel3D = ({ index, chars, onChange, isLocked }: WheelProps) => {
    const rotation = useMotionValue(0);
    const isDragging = useRef(false);

    // Convert index to rotation angle
    // Index 0 -> 0 degrees (Letter A at front)
    // Index 1 -> -ANGLE_PER_FACE degrees (Letter B at front)

    useEffect(() => {
        // Only animate if NOT dragging
        if (isDragging.current) return;

        const targetRotation = -index * ANGLE_PER_FACE;
        const controls = animate(rotation, targetRotation, {
            type: "spring",
            stiffness: 150,
            damping: 20
        });
        return controls.stop;
    }, [index, rotation]);

    const handlePan = (e: any, info: PanInfo) => {
        if (isLocked) return;
        isDragging.current = true;
        const delta = info.delta.x * 0.4;
        rotation.set(rotation.get() + delta);
    };

    const handlePanEnd = (e: any, info: PanInfo) => {
        if (isLocked) return;
        isDragging.current = false;

        const currentRot = rotation.get();
        const rawIndex = -currentRot / ANGLE_PER_FACE;
        const roundedIndex = Math.round(rawIndex);

        onChange(roundedIndex);
    };

    return (
        <motion.div
            className="relative w-[320px] h-[50px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
            style={{ perspective: "1000px" }}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
        >

            {/* The Rotating Cylinder */}
            <motion.div
                className="relative w-full h-full"
                style={{
                    transformStyle: "preserve-3d",
                    rotateY: rotation
                }}
            >
                {/* Faces */}
                {chars.map((char, i) => {
                    const angle = i * ANGLE_PER_FACE;
                    return (
                        <div
                            key={i}
                            className="absolute inset-0 flex items-center justify-center backface-visible"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                            }}
                        >
                            <div
                                className="flex items-center justify-center bg-[#0a0a0a] border-y border-primary/20 text-xl font-bold font-mono text-primary/80 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
                                style={{
                                    width: FACE_WIDTH,
                                    height: FACE_HEIGHT,
                                    backfaceVisibility: 'hidden',
                                    textShadow: '0 0 5px rgba(34, 197, 94, 0.3)'
                                }}
                            >
                                {char}
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Cylinder Shade Overlay (Static) to create roundness illusion */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-black z-20 opacity-90" />

            {/* Top/Bottom highlight lines for 3D feel */}
            <div className="absolute top-0 inset-x-0 h-px bg-white/10 z-30" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-black z-30" />
        </motion.div>
    );
};
