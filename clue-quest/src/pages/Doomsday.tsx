import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Zap } from "lucide-react";

const Doomsday = () => {
    const navigate = useNavigate();
    // Timer state - hardcoded to 03:00:00 for the visual
    const [timeLeft, setTimeLeft] = useState({ h: 3, m: 0, s: 0 });

    const handleBreach = () => {
        navigate("/game");
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 font-['Press_Start_2P'] bg-background relative overflow-hidden text-foreground">

            {/* Background Ambience (Matching Login/Intro) */}
            <div className="absolute inset-0 noise opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                        linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px"
                }}
            />

            {/* Game Boy Screen Effect Container - "The Box" */}
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-card border-8 border-border rounded-lg shadow-2xl overflow-hidden flex flex-col z-10 glow-primary scale-90 md:scale-100">

                {/* The "Scene" Area with Castle Background */}
                <div className="flex-1 relative flex flex-col items-center justify-center bg-gray-900 border-b-4 border-border overflow-hidden p-6 md:p-10">

                    {/* Scene Background - Custom Image */}
                    <div className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/intro-bg.png')" }}
                    >
                        {/* Dark Overlay for Readability */}
                        <div className="absolute inset-0 bg-black/60" />
                    </div>

                    {/* Content inside the Box */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-4 md:gap-6 text-center">

                        {/* Icons */}
                        <div className="flex gap-4 opacity-80 text-primary">
                            <Shield className="w-8 h-8 md:w-10 md:h-10" />
                            <Lock className="w-8 h-8 md:w-10 md:h-10" />
                        </div>

                        {/* Main Title */}
                        <div className="space-y-2">
                            <h1 className="text-xl md:text-3xl leading-tight text-white drop-shadow-[0_2px_0_#000]">
                                AVENGERS:
                            </h1>
                            <h2 className="text-lg md:text-2xl text-primary drop-shadow-[0_2px_0_#000] animate-pulse">
                                DOOMSDAY PROTOCOL
                            </h2>
                        </div>

                        {/* Timer Section */}
                        <div className="mt-2 space-y-2">
                            <p className="text-[8px] md:text-[10px] tracking-widest text-muted-foreground uppercase">Doomsday Clock Active</p>
                            <div className="flex items-center justify-center gap-2 md:gap-3 text-xl md:text-2xl text-primary drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                                <div className="bg-black/80 border-2 border-primary p-2 rounded shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                                    03
                                </div>
                                <span className="text-white animate-pulse">:</span>
                                <div className="bg-black/80 border-2 border-primary p-2 rounded shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                                    00
                                </div>
                                <span className="text-white animate-pulse">:</span>
                                <div className="bg-black/80 border-2 border-primary p-2 rounded shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                                    00
                                </div>
                            </div>
                            <div className="flex justify-between w-3/4 mx-auto text-[8px] text-muted-foreground">
                                <span>HRS</span>
                                <span>MIN</span>
                                <span>SEC</span>
                            </div>
                        </div>

                        {/* Transmission Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-background/90 border-2 border-primary p-3 md:p-4 rounded-lg max-w-lg mt-2 text-left relative shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-center gap-2 mb-1 text-primary text-[8px] md:text-[10px] uppercase tracking-widest border-b border-primary/20 pb-1">
                                <Zap className="w-3 h-3" />
                                Incoming Transmission
                            </div>

                            <p className="text-foreground leading-relaxed text-[8px] md:text-[10px] tracking-wide uppercase">
                                In a classified Marvel timeline, Doctor Doom initiates the Doomsday Protocol.
                                A global digital lockdown. You are not here to fight Doom.
                                You are here to escape his system.
                            </p>

                            <div className="mt-2 pt-2 border-t border-primary/20 text-center">
                                <p className="text-primary font-bold text-[8px] md:text-[10px] tracking-widest animate-pulse">
                                    #THE DISPLAY IS NOT DECORATIVE.<br />
                                    IT IS THE KEY.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Part of the Container - Replaces Dialogue Area */}
                <div className="h-1/5 bg-card flex items-center justify-center p-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBreach}
                        className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.5)] border-2 border-transparent"
                    >
                        <span className="flex items-center gap-2 text-[10px] md:text-xs">
                            <Zap className="w-4 h-4" />
                            Initiate Breach
                        </span>
                    </motion.button>
                </div>
            </div>

            <div className="mt-8 text-muted-foreground/50 text-xs font-mono">
                LOCKSTEP_OS v2.0.4
            </div>
        </div>
    );
};

export default Doomsday;
