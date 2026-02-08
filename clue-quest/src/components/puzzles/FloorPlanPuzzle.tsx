import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lightbulb, Terminal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText((prev) => text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(intervalId);
                onComplete?.();
            }
        }, 30); // Typing speed

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return <span>{displayedText}</span>;
};

interface FloorPlanPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

interface Hexagon {
    id: number;
    row: number;
    col: number;
    x: number;
    y: number;
}

export const FloorPlanPuzzle = ({ onSolve, level = 10 }: FloorPlanPuzzleProps) => {
    const [litHexagons, setLitHexagons] = useState<Set<number>>(new Set());
    const [feedback, setFeedback] = useState("");
    const [hoveredHex, setHoveredHex] = useState<number | null>(null);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        if (solved && onSolve) {
            const timer = setTimeout(() => {
                onSolve("SAFEPATH");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [solved, onSolve]);

    // Large asymmetric honeycomb - proper alternating offset
    const r = 38; // UPDATED: Increased Hexagon radius for larger view
    const vDist = r * 1.5; // Vertical distance for perfectly touching hexagons
    const hDist = r * Math.sqrt(3); // Horizontal distance for perfectly touching hexagons
    const cx = 350; // UPDATED: Centered horizontally in 700px viewBox
    const cy = 330; // UPDATED: Centered vertically (shifted down to accommodate larger grid)

    // 8-layer honeycomb with proper alternating offset (41 total hexagons - odd number)
    const hexagons: Hexagon[] = [
        // Layer 0: Top 5 hexagons (no offset)
        { id: 0, row: 0, col: 0, x: cx - hDist * 2, y: cy - vDist * 5 },
        { id: 1, row: 0, col: 1, x: cx - hDist, y: cy - vDist * 5 },
        { id: 2, row: 0, col: 2, x: cx, y: cy - vDist * 5 },
        { id: 3, row: 0, col: 3, x: cx + hDist, y: cy - vDist * 5 },
        { id: 4, row: 0, col: 4, x: cx + hDist * 2, y: cy - vDist * 5 },

        // Layer 1: 6 hexagons (OFFSET by -0.5)
        { id: 5, row: 1, col: 0, x: cx - hDist * 2.5, y: cy - vDist * 4 },
        { id: 6, row: 1, col: 1, x: cx - hDist * 1.5, y: cy - vDist * 4 },
        { id: 7, row: 1, col: 2, x: cx - hDist * 0.5, y: cy - vDist * 4 },
        { id: 8, row: 1, col: 3, x: cx + hDist * 0.5, y: cy - vDist * 4 },
        { id: 9, row: 1, col: 4, x: cx + hDist * 1.5, y: cy - vDist * 4 },
        { id: 10, row: 1, col: 5, x: cx + hDist * 2.5, y: cy - vDist * 4 },

        // Layer 2: 5 hexagons (NO offset - aligned with layer 0)
        { id: 11, row: 2, col: 0, x: cx - hDist * 2, y: cy - vDist * 3 },
        { id: 12, row: 2, col: 1, x: cx - hDist, y: cy - vDist * 3 },
        { id: 13, row: 2, col: 2, x: cx, y: cy - vDist * 3 },
        { id: 14, row: 2, col: 3, x: cx + hDist, y: cy - vDist * 3 },
        { id: 15, row: 2, col: 4, x: cx + hDist * 2, y: cy - vDist * 3 },

        // Layer 3: 6 hexagons (OFFSET by -0.5)
        { id: 16, row: 3, col: 0, x: cx - hDist * 2.5, y: cy - vDist * 2 },
        { id: 17, row: 3, col: 1, x: cx - hDist * 1.5, y: cy - vDist * 2 },
        { id: 18, row: 3, col: 2, x: cx - hDist * 0.5, y: cy - vDist * 2 },
        { id: 19, row: 3, col: 3, x: cx + hDist * 0.5, y: cy - vDist * 2 },
        { id: 20, row: 3, col: 4, x: cx + hDist * 1.5, y: cy - vDist * 2 },
        { id: 21, row: 3, col: 5, x: cx + hDist * 2.5, y: cy - vDist * 2 },

        // Layer 4: 5 hexagons (NO offset)
        { id: 22, row: 4, col: 0, x: cx - hDist * 2, y: cy - vDist },
        { id: 23, row: 4, col: 1, x: cx - hDist, y: cy - vDist },
        { id: 24, row: 4, col: 2, x: cx, y: cy - vDist },
        { id: 25, row: 4, col: 3, x: cx + hDist, y: cy - vDist },
        { id: 26, row: 4, col: 4, x: cx + hDist * 2, y: cy - vDist },

        // Layer 5: 6 hexagons (OFFSET by -0.5)
        { id: 27, row: 5, col: 0, x: cx - hDist * 2.5, y: cy },
        { id: 28, row: 5, col: 1, x: cx - hDist * 1.5, y: cy },
        { id: 29, row: 5, col: 2, x: cx - hDist * 0.5, y: cy },
        { id: 30, row: 5, col: 3, x: cx + hDist * 0.5, y: cy },
        { id: 31, row: 5, col: 4, x: cx + hDist * 1.5, y: cy },
        { id: 32, row: 5, col: 5, x: cx + hDist * 2.5, y: cy },

        // Layer 6: 5 hexagons (NO offset)
        { id: 33, row: 6, col: 0, x: cx - hDist * 2, y: cy + vDist },
        { id: 34, row: 6, col: 1, x: cx - hDist, y: cy + vDist },
        { id: 35, row: 6, col: 2, x: cx, y: cy + vDist },
        { id: 36, row: 6, col: 3, x: cx + hDist, y: cy + vDist },
        { id: 37, row: 6, col: 4, x: cx + hDist * 2, y: cy + vDist },

        // Layer 7: 3 hexagons (OFFSET by -0.5)
        { id: 38, row: 7, col: 0, x: cx - hDist * 0.5, y: cy + vDist * 2 },
        { id: 39, row: 7, col: 1, x: cx + hDist * 0.5, y: cy + vDist * 2 },
        { id: 40, row: 7, col: 2, x: cx + hDist * 1.5, y: cy + vDist * 2 },
    ];

    // Winning combinations: triangles formed by 3 hexagons across the grid that maximize coverage
    const winningCombinations = [
        [2, 33, 37],  // Ideally spread Triangle 1: Top-center, Lower-left, Lower-right
        [0, 4, 35],   // Ideally spread Triangle 2: Top-left, Top-right, Lower-center
        [22, 26, 39], // Ideally spread Triangle 3: Mid-left, Mid-right, Bottom-center
    ];

    // Helper to calculate distance between two hexagons
    const getDistance = (h1: Hexagon, h2: Hexagon) => {
        return Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2));
    };

    // Neighbors logic removed as requested - strict source lighting only

    // Calculate light intensity for all hexagons based on selected lights
    // 2 = Source (Brightest)
    // 0 = Dark
    const getLightMap = () => {
        const map = new Map<number, number>();
        hexagons.forEach(h => map.set(h.id, 0));

        litHexagons.forEach(id => {
            // Only light up the source, no neighbors
            map.set(id, 2);
        });
        return map;
    };

    const lightMap = getLightMap();

    // Correct solution set for feedback
    const correctSet = new Set(winningCombinations[0]);

    const handleHexagonClick = (hexId: number) => {
        if (solved) return;

        // If we already have 3 lights, we can't change anything until reset
        if (litHexagons.size >= 3) {
            setFeedback("⚠️ Maximum lights placed. Press RESET to try again.");
            return;
        }

        const newLitHexagons = new Set(litHexagons);

        // Since we are enforcing "3 clicks then reset", we typically don't allow toggling off
        // But if the user misclicked on the 1st or 2nd, maybe they can toggle?
        // The prompt says "it only has three click then they have to reset for again placing the lights"
        // This implies once 3 are placed, you are locked. It doesn't explicitly forbid undoing step 1 or 2
        // IF step 3 hasn't been taken.
        // However, "it only has three click" usually suggests a consumable resource.
        // Let's allow adding only. If you make a mistake, you reset.

        if (newLitHexagons.has(hexId)) {
            // Already lit - ignore click according to strict "3 clicks" rule?
            // Or allow toggle? Let's assume strict "only three clicks" means you add 3, then locked.
            // If I let them toggle, they have >3 clicks.
            return;
        }

        newLitHexagons.add(hexId);

        // Check if we have 3 lights
        if (newLitHexagons.size === 3) {
            // Check if it's a winning combination
            const litArray = Array.from(newLitHexagons).sort((a, b) => a - b);

            const isWinning = winningCombinations.some(combo => {
                const sortedCombo = [...combo].sort((a, b) => a - b);
                return JSON.stringify(litArray) === JSON.stringify(sortedCombo);
            });

            if (isWinning) {
                setSolved(true);
                setFeedback("✨ PERFECT COVERAGE! MAXIMUM LIGHT ACHIEVED!");
            } else {
                setFeedback("❌ Insufficient coverage. Press RESET to try again.");
            }
        }

        setLitHexagons(newLitHexagons);
    };

    const resetPuzzle = () => {
        setLitHexagons(new Set());
        setFeedback("");
        setSolved(false);
    };

    // Draw hexagon path for SVG
    const getHexagonPath = (centerX: number, centerY: number, size: number = 30) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        return `M ${points.join(" L ")} Z`;
    };

    return (
        <div className="w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg relative">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-1 flex flex-col flex-1 min-h-0 overflow-y-auto w-full relative">
                {/* Question Header */}
                <div className="space-y-1 flex flex-col flex-shrink-0">
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">&gt;</span>
                        <span className="text-primary/90 font-semibold">FLOOR PLAN ANALYSIS</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10 flex-shrink-0">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">
                                Light up 3 zones to maximize area coverage.<br />
                                <span className="text-red-400 font-semibold">Note: You only have 3 clicks.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* SVG Container */}
                <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden bg-black/40 rounded-lg border border-primary/20 shadow-inner p-2 md:p-4">
                    {/* Reset Button (Top Right) */}
                    <div className="absolute top-4 right-4 z-10">
                        <Button
                            onClick={resetPuzzle}
                            disabled={solved && litHexagons.size === 0}
                            className="font-['Press_Start_2P'] text-[10px] uppercase bg-black/60 hover:bg-primary/40 border border-primary/50 text-primary h-7 px-3 backdrop-blur-sm shadow-lg"
                        >
                            RESET
                        </Button>
                    </div>

                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            viewBox="0 0 700 540"
                            className="w-full h-full max-h-full object-contain"
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg"
                        >


                            {/* Draw hexagons */}
                            {hexagons.map((hex) => {
                                const intensity = lightMap.get(hex.id) || 0;
                                const isSource = intensity === 2;
                                const isCovered = intensity >= 1;

                                // -- Ambient Feedback Logic --
                                let ambientScale = 1;
                                let ambientOpacity = 0; // 0 to 1
                                let ambientColor = "transparent";

                                if (hoveredHex !== null) {
                                    const hoverSource = hexagons.find(h => h.id === hoveredHex);
                                    if (hoverSource) {
                                        const dist = getDistance(hex, hoverSource);
                                        const isCorrectHover = correctSet.has(hoveredHex);
                                        const reactionRadius = isCorrectHover ? r * 8 : r * 3; // Correct hexes feel "larger"

                                        if (dist < reactionRadius) {
                                            // Normalized intensity (1 = close, 0 = far)
                                            const power = 1 - (dist / reactionRadius);

                                            if (isCorrectHover) {
                                                // Strong, calm, symmetrical ripple (Cyan/Blue hint)
                                                ambientOpacity = power * 0.15;
                                                ambientScale = 1 + (power * 0.05);
                                                ambientColor = "#06b6d4"; // Unified Cyan
                                            } else {
                                                // Weak, irregular flicker (Cyan - same color, different feel)
                                                // Add some noise based on ID to feel "irregular"
                                                const noise = (hex.id % 3) * 0.5;
                                                ambientOpacity = power * 0.05 * noise;
                                                ambientScale = 1 + (power * 0.02 * (hex.id % 2 === 0 ? 1 : -0.5));
                                                ambientColor = "#06b6d4"; // Unified Cyan
                                            }
                                        }
                                    }
                                }

                                // If solution nodes are active/hovered, they might harmonize? 
                                // Check if current node is 'Correct' and hovered - give it extra "calm"
                                if (correctSet.has(hex.id) && hoveredHex === hex.id) {
                                    ambientColor = "#06b6d4";
                                    ambientOpacity = 0.2;
                                    ambientScale = 1.05;
                                }

                                // Colors: Source=Bright Green, Covered=Dim Green, Unlit=Gray
                                const strokeColor = isSource ? "#22c55e" : (isCovered ? "#4ade80" : "#4b5563");
                                const shadow = isSource
                                    ? "drop-shadow(0 0 15px #22c55e)"
                                    : (isCovered ? "drop-shadow(0 0 5px #4ade80)" : "none");

                                return (
                                    <g key={hex.id}
                                        onMouseEnter={() => setHoveredHex(hex.id)}
                                        onMouseLeave={() => setHoveredHex(null)}
                                    >
                                        {/* Ambient Glow Underlay */}
                                        <motion.path
                                            d={getHexagonPath(hex.x, hex.y, r)}
                                            fill={ambientColor}
                                            stroke="transparent"
                                            initial={false}
                                            animate={{
                                                opacity: ambientOpacity,
                                                scale: ambientScale
                                            }}
                                            transition={{
                                                duration: correctSet.has(hoveredHex || -1) ? 0.8 : 0.2, // Slow calm vs fast jitter
                                                ease: "easeInOut"
                                            }}
                                            className="pointer-events-none"
                                            style={{ transformOrigin: `${hex.x}px ${hex.y}px` }}
                                        />

                                        <motion.path
                                            d={getHexagonPath(hex.x, hex.y, r)}
                                            fill={isCovered ? "#22c55e20" : "transparent"} // Slight fill for covered area
                                            stroke={strokeColor}
                                            strokeWidth={isSource ? "3" : "2"}
                                            onClick={() => handleHexagonClick(hex.id)}
                                            className={cn(
                                                "cursor-pointer transition-all duration-300",
                                                !solved && "hover:fill-[#4ade80]/10"
                                            )}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{ filter: shadow }}
                                        />
                                        {/* Center Dot Indicator */}
                                        <circle
                                            cx={hex.x}
                                            cy={hex.y}
                                            r={isSource ? 8 : (isCovered ? 4 : 2)}
                                            fill={isSource ? "#22c55e" : (isCovered ? "#4ade80" : "#6b7280")}
                                            className="pointer-events-none"
                                            opacity={isCovered ? 1 : 0.5}
                                        >
                                            {isSource && (
                                                <animate
                                                    attributeName="opacity"
                                                    values="1;0.5;1"
                                                    dur="1s"
                                                    repeatCount="indefinite"
                                                />
                                            )}
                                        </circle>
                                    </g>
                                );
                            })}

                            {/* Connection Lines (Draw triangle ONLY if solved) */}
                            {litHexagons.size === 3 && solved && (
                                <motion.path
                                    d={`M ${Array.from(litHexagons).map(id => {
                                        const h = hexagons.find(hex => hex.id === id);
                                        return `${h?.x},${h?.y}`;
                                    }).join(" L ")} Z`}
                                    initial={{ pathLength: 0, fillOpacity: 0 }}
                                    animate={{ pathLength: 1, fillOpacity: 1 }}
                                    transition={{
                                        pathLength: { duration: 1.5, ease: "easeInOut" },
                                        fillOpacity: { duration: 0.8, ease: "easeIn", delay: 1.5 }
                                    }}
                                    stroke="#ffffff"
                                    strokeWidth="4"
                                    fill="#22c55e"
                                    className="pointer-events-none drop-shadow-[0_0_1px_rgba(255,255,255,0.2)]"
                                />
                            )}

                            {/* Re-draw Source Nodes on Top */}
                            {litHexagons.size === 3 && solved && Array.from(litHexagons).map(id => {
                                const h = hexagons.find(hex => hex.id === id);
                                if (!h) return null;
                                return (
                                    <circle
                                        key={`top-${id}`}
                                        cx={h.x}
                                        cy={h.y}
                                        r={8}
                                        fill="#22c55e"
                                        className="pointer-events-none"
                                    >
                                        <animate
                                            attributeName="opacity"
                                            values="1;0.5;1"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>

            {/* Footer with Reset */}
            <div className="p-4 z-20 relative bg-black/50 border-t border-primary/20 backdrop-blur-sm flex items-center justify-between h-14">
                <div className="font-['Press_Start_2P'] text-[10px] text-primary flex items-center gap-2 flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${litHexagons.size >= 1 ? 'bg-primary shadow-[0_0_5px_#22c55e]' : 'bg-primary/20'}`} />
                    <div className={`w-2 h-2 rounded-full ${litHexagons.size >= 2 ? 'bg-primary shadow-[0_0_5px_#22c55e]' : 'bg-primary/20'}`} />
                    <div className={`w-2 h-2 rounded-full ${litHexagons.size >= 3 ? 'bg-primary shadow-[0_0_5px_#22c55e]' : 'bg-primary/20'}`} />
                    <span className="ml-2 hidden sm:inline">NODES: {litHexagons.size}/3</span>
                </div>

                {/* Central Feedback Message */}
                <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[50%] text-center pointer-events-none">
                    {feedback && (
                        <div className={cn(
                            "font-['Press_Start_2P'] text-[10px] md:text-xs leading-tight px-2 break-words whitespace-normal",
                            solved ? "text-green-400 drop-shadow-[0_0_2px_rgba(74,222,128,0.4)]" : "text-red-400 drop-shadow-[0_0_2px_rgba(248,113,113,0.4)]"
                        )}>
                            <TypewriterText text={feedback} />
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 min-w-[100px] flex justify-end">
                    {/* Proceed button removed for auto-navigation */}
                </div>
            </div>
        </div>
    );
};