import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookRevealProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    isTarget: boolean;
    startPos: { x: number; y: number };
}

const BookReveal = ({ isOpen, onClose, content, isTarget, startPos }: BookRevealProps) => {
    // idle -> fly-in (move to center) -> opening (cover opens) -> flipping (pages flip) -> revealing (text appears)
    const [stage, setStage] = useState<'idle' | 'fly-in' | 'opening' | 'flipping' | 'revealing'>('idle');

    useEffect(() => {
        if (isOpen) {
            setStage('fly-in');
            const t1 = setTimeout(() => setStage('opening'), 1000);
            const t2 = setTimeout(() => setStage('flipping'), 2000);
            const t3 = setTimeout(() => setStage('revealing'), 3500);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        } else {
            setStage('idle');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Helper for page flipping variants
    const flipPageVariants = (delay: number) => ({
        initial: { rotateY: 0 },
        animate: {
            rotateY: stage === 'flipping' || stage === 'revealing' ? -180 : 0,
            transition: { duration: 1.2, delay: delay, ease: "easeInOut" as const }
        }
    });

    // Book Dimensions (Increased Size)
    const width = 360;
    const height = 500;
    const thickness = 50;
    const coverThickness = 8;

    // DOOM THEME COLORS
    const colors = {
        coverBase: '#052e16',
        coverDark: '#020f07',
        spine: '#064e3b',
        spineDark: '#022c22',
        gold: '#fbbf24',
        page: '#fef3c7',
        pageEdge: '#d4c5a3',
    };

    // Cover variants for stable state transitions
    const coverVariants = {
        closed: { rotateY: 0, transition: { duration: 1.5, ease: "easeInOut" as const } },
        open: { rotateY: -175, transition: { duration: 1.5, ease: "easeInOut" as const } }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-[2500px] pointer-events-none">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
                    onClick={onClose}
                />

                {/* MAIN BOOK CONTAINER */}
                <motion.div
                    initial={{
                        x: startPos.x - window.innerWidth / 2,
                        y: startPos.y - window.innerHeight / 2,
                        z: 0,
                        rotateX: 30, // Reduced from 60
                        rotateY: 45,
                        rotateZ: -20,
                        scale: 0.1,
                    }}
                    animate={{
                        x: 0,
                        y: 0,
                        z: 100,
                        rotateX: 10,
                        rotateY: -10,
                        rotateZ: 0,
                        scale: 1,
                        transition: { duration: 1.0, ease: "circOut" as const }
                    }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                    className="relative pointer-events-auto"
                    style={{
                        width,
                        height,
                        transformStyle: 'preserve-3d'
                    }}
                >


                    {/* === BACK COVER (Stationary Base) === */}
                    <div
                        className="absolute inset-0 rounded-r-md"
                        style={{
                            backgroundColor: colors.coverBase,
                            transform: `translateZ(-${thickness / 2 + coverThickness}px)`
                        }}
                    >
                        {/* Back Cover Edge */}
                        <div
                            className="absolute right-0 top-0 bottom-0 w-[8px] origin-right"
                            style={{
                                backgroundColor: colors.coverDark,
                                transform: 'rotateY(-90deg)'
                            }}
                        />
                    </div>


                    {/* === PAGE BLOCK === */}
                    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>

                        {/* Right Face (Page Edges) */}
                        <div
                            className="absolute right-0 top-[4px] bottom-[4px] origin-right"
                            style={{
                                width: thickness,
                                backgroundColor: colors.pageEdge,
                                transform: 'rotateY(90deg) translateZ(0px)',
                                backgroundImage: `repeating-linear-gradient(90deg, ${colors.pageEdge} 0px, #fff 1px, ${colors.pageEdge} 2px)`,
                                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)'
                            }}
                        />

                        {/* Top Face (Page Edges) */}
                        <div
                            className="absolute top-[4px] right-0 left-0 origin-top"
                            style={{
                                height: thickness,
                                backgroundColor: colors.pageEdge,
                                transform: `rotateX(-90deg) translateZ(0px)`,
                                backgroundImage: `repeating-linear-gradient(0deg, ${colors.pageEdge} 0px, #fff 1px, ${colors.pageEdge} 2px)`,
                                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)'
                            }}
                        />

                        {/* Bottom Face (Page Edges) */}
                        <div
                            className="absolute bottom-[4px] right-0 left-0 origin-bottom"
                            style={{
                                height: thickness,
                                backgroundColor: colors.pageEdge,
                                transform: `rotateX(90deg) translateZ(0px)`,
                                backgroundImage: `repeating-linear-gradient(0deg, ${colors.pageEdge} 0px, #fff 1px, ${colors.pageEdge} 2px)`,
                                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)'
                            }}
                        />

                        {/* The Actual "Page" Surface (Right Side Static Page) */}
                        {/* Pushed FURTHER back to -6px to avoid Z-fighting/white flash */}
                        {/* HIDDEN during fly-in to prevent any white flash passing through cover */}
                        <div
                            className="absolute inset-0 rounded-r-sm flex flex-col items-center justify-center p-10 text-center"
                            style={{
                                backgroundColor: colors.page,
                                transform: `translateZ(${thickness / 2 - 6}px)`,
                                top: 4, bottom: 4, right: 3, left: 0,
                                boxShadow: 'inset 5px 0 30px rgba(0,0,0,0.1)',
                                visibility: (stage === 'idle' || stage === 'fly-in') ? 'hidden' : 'visible'
                            }}
                        >
                            {/* Page Texture */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` }}
                            />

                            {/* REVEAL CONTENT */}
                            {stage === 'revealing' && (
                                <motion.div
                                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    transition={{ duration: 1.5 }}
                                    className="relative z-10 w-full h-full flex flex-col items-center justify-between py-4"
                                >
                                    <div className="border-b-2 border-red-900/30 w-full pb-4">
                                        <div className="text-red-900/60 text-[10px] uppercase font-serif tracking-[0.4em]">
                                            Classified 1978 // Dept. H
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center">
                                        <div className={cn(
                                            "text-7xl font-black font-mono tracking-tighter mix-blend-multiply",
                                            isTarget ? "text-red-700" : "text-zinc-600"
                                        )}
                                            style={{
                                                textShadow: isTarget ? '0 0 30px rgba(220, 38, 38, 0.4)' : 'none'
                                            }}
                                        >
                                            {content}
                                        </div>
                                    </div>

                                    <div className="w-full border-t border-red-900/10 pt-6">
                                        <div className="text-zinc-500 text-[10px] font-mono leading-relaxed text-left">
                                            <span className="text-red-700">&gt;&gt;</span> SUBJECT: DOOM<br />
                                            <span className="text-red-700">&gt;&gt;</span> ORIGIN: LATVERIA<br />
                                            <span className="text-red-700">&gt;&gt;</span> CLEARANCE: OMEGA
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>


                    {/* === SPINE === */}
                    <div
                        className="absolute top-0 bottom-0 left-0 w-[56px] rounded-l-sm origin-left"
                        style={{
                            transform: `rotateY(-90deg) translateZ(${thickness / 2}px)`,
                            background: `linear-gradient(to right, ${colors.coverBase} 0%, ${colors.spine} 40%, ${colors.spine} 60%, ${colors.coverBase} 100%)`,
                        }}
                    >
                        {/* Gold Ribs on Spine (More prominent) */}
                        {[10, 15, 85, 90].map((pos, i) => (
                            <div
                                key={i}
                                className="absolute left-0 right-0 h-[3px] shadow-sm"
                                style={{
                                    top: `${pos}%`,
                                    backgroundColor: colors.gold,
                                    opacity: 0.6
                                }}
                            />
                        ))}
                    </div>


                    {/* === FRONT COVER (Animated Group) === */}
                    <motion.div
                        variants={coverVariants}
                        initial="closed"
                        animate={stage === 'opening' || stage === 'flipping' || stage === 'revealing' ? 'open' : 'closed'}
                        className="absolute inset-0 z-50 origin-left"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: `translateZ(${thickness / 2}px)`
                        }}
                    >
                        {/* FRONT FACE (The Cover Art) */}
                        <div
                            className="absolute inset-0 rounded-r-md border-l-4 border-black/20 flex items-center justify-center overflow-hidden"
                            style={{
                                backgroundColor: colors.coverBase,
                                backfaceVisibility: 'hidden',
                                transform: `translateZ(${coverThickness}px)`,
                                boxShadow: '-5px 0 15px rgba(0,0,0,0.5) inset'
                            }}
                        >
                            {/* Leather Texture */}
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[length:3px_3px]" />

                            {/* Ornate Border */}
                            <div className="absolute inset-6 border-[3px] rounded-sm flex flex-col items-center justify-center p-6"
                                style={{ borderColor: colors.gold, opacity: 0.5 }}
                            >
                                {/* Corner Decorations */}
                                <div className="absolute top-2 left-2 w-8 h-8 border-l-[3px] border-t-[3px]" style={{ borderColor: colors.gold }} />
                                <div className="absolute top-2 right-2 w-8 h-8 border-r-[3px] border-t-[3px]" style={{ borderColor: colors.gold }} />
                                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-[3px] border-b-[3px]" style={{ borderColor: colors.gold }} />
                                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-[3px] border-b-[3px]" style={{ borderColor: colors.gold }} />

                                {/* Center Title */}
                                <div className="text-5xl font-serif mb-6 drop-shadow-lg tracking-widest" style={{ color: colors.gold }}>
                                    V.D.
                                </div>

                                <div className="h-[1px] w-24 mb-6" style={{ backgroundColor: colors.gold }} />

                                <div className="text-center font-serif text-sm tracking-[0.4em] uppercase" style={{ color: colors.gold, opacity: 0.9 }}>
                                    Private<br />Journals
                                </div>
                            </div>
                        </div>

                        {/* RIGHT EDGE (Cover Thickness) */}
                        <div
                            className="absolute right-0 top-0 bottom-0 origin-right"
                            style={{
                                width: coverThickness,
                                backgroundColor: colors.coverDark,
                                transform: 'rotateY(90deg)',
                                background: `linear-gradient(to bottom, ${colors.coverBase}, ${colors.coverDark}, ${colors.coverBase})`
                            }}
                        />

                        {/* TOP EDGE */}
                        <div
                            className="absolute top-0 left-0 right-0 origin-top"
                            style={{
                                height: coverThickness,
                                backgroundColor: colors.coverDark,
                                transform: 'rotateX(90deg)',
                                background: `linear-gradient(to right, ${colors.coverBase}, ${colors.coverDark}, ${colors.coverBase})`
                            }}
                        />

                        {/* BOTTOM EDGE */}
                        <div
                            className="absolute bottom-0 left-0 right-0 origin-bottom"
                            style={{
                                height: coverThickness,
                                backgroundColor: colors.coverDark,
                                transform: 'rotateX(-90deg)',
                                background: `linear-gradient(to right, ${colors.coverBase}, ${colors.coverDark}, ${colors.coverBase})`
                            }}
                        />

                        {/* INNER FACE (Inside Cover) */}
                        <div
                            className="absolute inset-0 rounded-r-md flex items-center justify-center"
                            style={{
                                backgroundColor: '#fdf6e3', // Lighter inner color
                                transform: 'rotateY(180deg)',
                                backfaceVisibility: 'hidden',
                                boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div className="text-zinc-400 font-serif italic text-xs">
                                Ex Libris<br />Latveria
                            </div>
                        </div>
                    </motion.div>


                    {/* === FLIPPING PAGES (Animation) === */}
                    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: `translateZ(${thickness / 2}px)` }}>
                        {/* Page 1 */}
                        <motion.div
                            variants={flipPageVariants(0.2)}
                            initial="initial"
                            animate="animate"
                            className="absolute inset-y-[4px] left-0 right-[4px] rounded-r-md origin-left border-l border-neutral-300 shadow-sm"
                            style={{
                                backgroundColor: colors.page,
                                backfaceVisibility: 'hidden',
                                zIndex: 40
                            }}
                        />
                        {/* Page 2 */}
                        <motion.div
                            variants={flipPageVariants(0.5)}
                            initial="initial"
                            animate="animate"
                            className="absolute inset-y-[4px] left-0 right-[4px] rounded-r-md origin-left border-l border-neutral-300 shadow-sm"
                            style={{
                                backgroundColor: colors.page,
                                backfaceVisibility: 'hidden',
                                zIndex: 39
                            }}
                        />
                    </div>


                    {/* === CLOSE BUTTON === */}
                    {stage === 'revealing' && (
                        <motion.button
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            onClick={onClose}
                            className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-mono uppercase tracking-widest text-xs border border-white/10 transition-all hover:scale-105"
                            style={{ transform: 'translateZ(150px)' }} // Float in front
                        >
                            <X className="w-4 h-4" />
                            Close File
                        </motion.button>
                    )}

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookReveal;
