import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ArrowLeft } from "lucide-react";
import { AnswerInput } from "@/components/AnswerInput";

interface OpticalPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

const ANSWER = "ILLUSION";
const HINT = "Light explains shadows.\nShadows explain lies.";

const ROOM_IMAGE = "/still-room.jpg";

export const OpticalPuzzle = ({ onSolve, level = 6 }: OpticalPuzzleProps) => {
    const [frameOpened, setFrameOpened] = useState(false);
    const [frameFlipped, setFrameFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);

    const handleFrameClick = () => {
        if (!frameOpened) {
            setFrameOpened(true);
        }
    };

    const handleOpenedFrameClick = () => {
        if (!frameFlipped) {
            setFrameFlipped(true);
            setHasFlipped(true);
        }
    };

    const handleCloseModal = () => {
        setFrameOpened(false);
        setFrameFlipped(false);
        setHasFlipped(false);
    };

    const handleGoBack = () => {
        setFrameOpened(false);
        setFrameFlipped(false);
    };

    const handleSolve = async (answer: string): Promise<boolean> => {
        const trimmedInput = answer.trim().toUpperCase();
        
        if (trimmedInput === ANSWER) {
            setSolved(true);
            setFeedback("✓ VISUAL DISTORTION CORRECTED.");
            setTimeout(() => {
                onSolve?.(ANSWER);
            }, 1000);
            return true;
        } else {
            setFeedback("✗ ILLUSION PERSISTS. LOOK CLOSER.");
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
                        <span className="text-primary/90 font-semibold">PERCEPTUAL DISTORTION TEST</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">Nothing in this room is broken — but something is wrong; what hidden concept is concealed in this scene?</p>
                        </div>
                    </div>
                </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative overflow-hidden p-2 mt-3">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-2xl w-full max-w-3xl" style={{ maxHeight: '100%', aspectRatio: '16/10' }}>
                    {/* Room Image */}
                    <img 
                        src={ROOM_IMAGE}
                        alt="A mysterious room"
                        className="w-full h-full object-cover"
                    />

                    
                    {/* Invisible clickable frame area - positioned over the painting */}
                    {!hasFlipped && (
                        <motion.div
                            onClick={handleFrameClick}
                            whileHover={{ scale: 1.02 }}
                            className="absolute cursor-pointer"
                            style={{
                                left: '4%',
                                top: '12%',
                                width: '24%',
                                height: '32%',
                            }}
                        >
                            {/* Transparent clickable area */}
                            <div className="w-full h-full bg-transparent" />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal - Opens when frame is clicked */}
            <AnimatePresence>
                {frameOpened && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    >
                        {/* Close button */}
                        {!frameFlipped && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
                                onClick={handleCloseModal}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        )}

                        {/* Flippable Frame */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative"
                            style={{ perspective: '1000px' }}
                        >
                            <motion.div
                                animate={{ rotateY: frameFlipped ? 180 : 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className="relative"
                            >
                                {/* Front - Painting Image */}
                                <motion.div
                                    onClick={!hasFlipped ? handleOpenedFrameClick : undefined}
                                    className={!hasFlipped ? "cursor-pointer" : ""}
                                    style={{ backfaceVisibility: 'hidden' }}
                                    whileHover={!hasFlipped ? { scale: 1.02 } : {}}
                                >
                                    {/* Wooden Frame Border */}
                                    <div 
                                        className="p-3 md:p-4 rounded shadow-2xl"
                                        style={{
                                            background: 'linear-gradient(145deg, #6b4423 0%, #4a2f17 25%, #5c3a1d 50%, #3d2512 75%, #5c3a1d 100%)',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        {/* Inner frame edge */}
                                        <div 
                                            className="p-1 rounded-sm"
                                            style={{
                                                background: 'linear-gradient(145deg, #3d2512 0%, #2a1a0d 100%)',
                                                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            {/* Painting Canvas */}
                                            <div className="w-64 h-44 md:w-80 md:h-56 overflow-hidden rounded-sm">
                                                <img 
                                                    src={ROOM_IMAGE}
                                                    alt="Landscape painting"
                                                    className="w-full h-full object-cover"
                                                    style={{
                                                        objectPosition: '0% 0%',
                                                        transform: 'scale(2.5)',
                                                        transformOrigin: '15% 25%',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </motion.div>

                                {/* Back - Message */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ 
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                    }}
                                >
                                    {/* Wooden Frame Back */}
                                    <div 
                                        className="p-3 md:p-4 rounded shadow-2xl"
                                        style={{
                                            background: 'linear-gradient(145deg, #5c4033 0%, #3d2914 25%, #4a3728 50%, #2d1f14 75%, #4a3728 100%)',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        {/* Wood grain texture */}
                                        <div className="absolute inset-0 opacity-10 rounded"
                                            style={{
                                                backgroundImage: `repeating-linear-gradient(
                                                    0deg,
                                                    transparent,
                                                    transparent 8px,
                                                    rgba(0,0,0,0.1) 8px,
                                                    rgba(5, 5, 5, 0.1) 10px
                                                )`,
                                            }}
                                        />
                                        
                                        {/* Inner dark area with message */}
                                        <div 
                                            className="w-64 h-44 md:w-80 md:h-56 rounded-sm flex flex-col items-center justify-center relative"
                                            style={{
                                                background: 'linear-gradient(135deg, #1a1208 0%, #2d1f14 50%, #1a1208 100%)',
                                                boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {/* Message */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-center px-4"
                                            >
                                                <div 
                                                    className="text-sm md:text-base font-serif text-amber-100/70 leading-relaxed"
                                                    style={{ 
                                                        fontFamily: 'Georgia, serif',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    OPTICAL <span style={{ backgroundColor: 'black', color: 'white', padding: '2px 4px' }}>ILLUSION</span>
                                                </div>
                                            </motion.div>

                                            {/* Back button */}
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                                onClick={handleGoBack}
                                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-amber-900/50 hover:bg-amber-900/70 border border-amber-700/50 rounded text-amber-100/80 text-[10px] transition-colors"
                                            >
                                                <ArrowLeft className="w-3 h-3" />
                                                GO BACK
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* Answer Input - Only shows after going back from flipped */}
            <div className="space-y-4 mt-auto p-4 z-20 relative">
            <AnimatePresence>
                {hasFlipped && !frameFlipped && !solved && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                    >
                        <AnswerInput
                            onSubmit={handleSolve}
                            successMessage={feedback}
                            errorMessage={feedback}
                            withExecuteButton
                            feedbackPlacement="top"
                            disabled={solved}
                            placeholder="TYPE THE ANSWER..."
                            buttonText="EXECUTE"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

        </div>
    );
};

export default OpticalPuzzle;
