import { useEffect, useRef } from 'react';
import p5 from 'p5';
import sketch from './tpuzzle/sketch';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TPuzzleProps {
    onSolve?: (answer: string) => void;
}

export const TPuzzle = ({ onSolve }: TPuzzleProps) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    useEffect(() => {
        if (!sketchRef.current) return;

        // Create p5 instance with the sketch
        const p5Instance = new p5((p: any) => {
            // Pass onSolve callback to the sketch
            (p as any).onSolveCallback = onSolve;
            // Call the original sketch function
            sketch(p);
        }, sketchRef.current);

        p5InstanceRef.current = p5Instance;

        // Cleanup on unmount
        return () => {
            p5Instance.remove();
            p5InstanceRef.current = null;
        };
    }, [onSolve]);

    const handleReset = () => {
        // Call the reset function from the p5 sketch
        if (p5InstanceRef.current && (p5InstanceRef.current as any).resetPuzzle) {
            (p5InstanceRef.current as any).resetPuzzle();
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg relative z-20">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer 13
                </span>
            </div>

            <div className="px-3 py-2 space-y-1 flex flex-col flex-1 min-h-0 overflow-hidden w-full">
                {/* Question Header */}
                <div className="space-y-1 flex flex-col">
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">&gt;</span>
                        <span className="text-primary/90 font-semibold">GEOMETRIC RECONSTRUCTION</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10 flex-shrink-0">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">
                                Reassemble the scattered fragments. The output must conform to the 'T' standard. Precision is mandatory.
                            </p>
                        </div>
                    </div>
                </div>

                {/* P5.js Canvas Container with Reset Button */}
                <div className="flex-1 w-full relative" style={{ minHeight: 0 }}>
                    {/* Reset Button (Top Right) */}
                    <div className="absolute top-4 right-4 z-50">
                        <Button
                            onClick={handleReset}
                            className="font-['Press_Start_2P'] text-[10px] uppercase bg-black/60 hover:bg-primary/40 border border-primary/50 text-primary h-7 px-3 backdrop-blur-sm shadow-lg"
                        >
                            RESET
                        </Button>
                    </div>

                    {/* P5 Canvas */}
                    <div ref={sketchRef} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
};
