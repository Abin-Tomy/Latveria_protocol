import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ScrambledPaperRevealProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    startPos: { x: number; y: number };
}

const ScrambledPaperReveal = ({ isOpen, onClose, content, startPos }: ScrambledPaperRevealProps) => {
    // stages: idle -> toss -> uncrumple -> reading
    const [stage, setStage] = useState<'idle' | 'toss' | 'uncrumple' | 'reading'>('idle');

    useEffect(() => {
        if (isOpen) {
            setStage('toss');
            const t1 = setTimeout(() => setStage('uncrumple'), 800);
            const t2 = setTimeout(() => setStage('reading'), 2000);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            setStage('idle');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Paper dimensions
    const expandedWidth = 400;
    const expandedHeight = 500;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    onClick={onClose}
                />

                {/* PROJECTILE & PAPER CONTAINER */}
                <motion.div
                    initial={{
                        x: startPos.x - window.innerWidth / 2,
                        y: startPos.y - window.innerHeight / 2,
                        scale: 0.2,
                        rotate: 360,
                    }}
                    animate={{
                        x: 0,
                        y: 0,
                        scale: stage === 'toss' ? 0.5 : 1,
                        rotate: stage === 'toss' ? 0 : (stage === 'reading' ? -2 : 0), // Slight tilt for realism
                        transition: {
                            type: "spring",
                            damping: 12,
                            stiffness: 100
                        }
                    }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="relative pointer-events-auto flex items-center justify-center"
                >
                    {/* THE PAPER ITSELF */}
                    <motion.div
                        className="relative bg-[#f5f5dc] shadow-2xl overflow-hidden flex items-center justify-center text-center p-8"
                        initial={{
                            width: 100,
                            height: 100,
                            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", // Irregular
                            background: "radial-gradient(circle at 30% 30%, #f0f0c9, #c4c495)",
                            boxShadow: "5px 5px 15px rgba(0,0,0,0.4), inset -5px -5px 20px rgba(0,0,0,0.2)"
                        }}
                        animate={{
                            width: stage === 'toss' ? 120 : expandedWidth,
                            height: stage === 'toss' ? 120 : expandedHeight,
                            borderRadius: stage === 'toss' ? "45% 55% 40% 60% / 55% 45% 60% 40%" : "2px", // Morphing blob
                            rotate: stage === 'toss' ? 360 : (stage === 'reading' ? -2 : 0),
                            background: stage === 'toss'
                                ? "radial-gradient(circle at 30% 30%, #f0f0c9, #a8a875)"
                                : "linear-gradient(135deg, #fdfbf7 0%, #f5f5dc 100%)",
                            boxShadow: stage === 'toss'
                                ? "0 10px 20px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2)"
                                : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            transition: {
                                duration: 1.2,
                                ease: [0.34, 1.56, 0.64, 1] // Elastic unfolding
                            }
                        }}
                    >
                        {/* Crumpled Texture Overlay for Ball Stage */}
                        {stage === 'toss' && (
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                                    filter: 'contrast(150%) brightness(90%)'
                                }}
                            />
                        )}
                        {/* Wrinkle Textures (Only visible when unfolded) */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                                filter: 'contrast(120%) brightness(90%)'
                            }}
                            animate={{ opacity: stage === 'reading' ? 0.3 : 0 }}
                        />

                        {/* Crease Lines simulating unfolding */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: stage === 'reading' ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Vertical Crease */}
                            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black/10 blur-[1px]" />
                            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-black/10 blur-[1px]" />
                            {/* Horizontal Crease */}
                            <div className="absolute left-0 right-0 top-1/4 h-px bg-black/10 blur-[1px]" />
                            <div className="absolute left-0 right-0 bottom-1/4 h-px bg-black/10 blur-[1px]" />
                        </motion.div>

                        {/* Content */}
                        {stage === 'reading' && (
                            <motion.div
                                initial={{ opacity: 0, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 0.8 }}
                                className="relative z-10 w-full h-full flex flex-col items-center justify-center font-mono"
                            >
                                <div className="border-4 border-red-800/80 p-6 rotate-1">
                                    <h2 className="text-4xl md:text-5xl font-bold text-red-900 tracking-tighter mix-blend-multiply text-center">
                                        {content}
                                    </h2>
                                </div>
                                <p className="mt-8 text-sm text-zinc-500 font-serif italic">
                                    - Disposal Unit Log #402 -
                                </p>
                            </motion.div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ScrambledPaperReveal;
