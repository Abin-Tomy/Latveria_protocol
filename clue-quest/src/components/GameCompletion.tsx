import { motion } from "framer-motion";
import { Shield, Clock, LogOut, Terminal, FileCheck, Swords } from "lucide-react";
import { useEffect, useState } from "react";
import { MatrixBackground } from "./ui/MatrixBackground";

interface GameCompletionProps {
    teamName: string | null;
    startTime: Date;
    onReset: () => void;
}

const GlitchText = ({ text }: { text: string }) => {
    return (
        <div className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-green-400 opacity-70 animate-pulse translate-x-[2px]">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-400 opacity-70 animate-pulse -translate-x-[2px]">{text}</span>
        </div>
    );
};

export const GameCompletion = ({ teamName, startTime, onReset }: GameCompletionProps) => {
    const [timeTaken, setTimeTaken] = useState("");
    const [showContent, setShowContent] = useState(false);
    const [displayTeamName, setDisplayTeamName] = useState("");
    const [agent1, setAgent1] = useState("");
    const [agent2, setAgent2] = useState("");

    useEffect(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setTimeTaken(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );

        // Parse Team Name
        try {
            if (teamName) {
                // Check if it looks like JSON
                if (teamName.trim().startsWith('{')) {
                    const parsed = JSON.parse(teamName);
                    // Use teamName OR teamId, otherwise fallback to raw string but truncated if too long
                    setDisplayTeamName(parsed.teamName || parsed.teamId || "UNKNOWN TEAM");
                    setAgent1(parsed.agent1 || "N/A");
                    setAgent2(parsed.agent2 || "N/A");
                } else {
                    setDisplayTeamName(teamName);
                    setAgent1("UNKNOWN");
                    setAgent2("UNKNOWN");
                }
            } else {
                setDisplayTeamName("UNKNOWN");
                setAgent1("UNKNOWN");
                setAgent2("UNKNOWN");
            }
        } catch (e) {
            setDisplayTeamName(teamName || "UNKNOWN");
            setAgent1("UNKNOWN");
            setAgent2("UNKNOWN");
        }

        // Sequence animation
        setTimeout(() => setShowContent(true), 2000);
    }, [startTime, teamName]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 overflow-hidden font-mono"
        >
            {/* Matrix Background */}
            <div className="absolute inset-0 opacity-40">
                <MatrixBackground />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />

            <div className="relative z-20 w-full max-w-lg max-h-screen overflow-y-auto scrollbar-none py-2 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
                    className="bg-black/90 backdrop-blur-md border border-primary/30 p-5 rounded-xl shadow-[0_0_100px_rgba(34,197,94,0.15)] flex flex-col items-center text-center relative overflow-hidden w-full"
                >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-xl" />
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    {/* Header Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="mb-2 relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <Shield className="w-16 h-16 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                    </motion.div>

                    {/* Main Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-1 mb-4"
                    >
                        <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary to-primary/60 tracking-tighter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            <GlitchText text="SYSTEM COMPROMISED" />
                        </h1>
                        <p className="text-primary text-xs md:text-sm tracking-[0.2em] uppercase animate-pulse font-bold">
                            ROOT ACCESS GRANTED // LEVEL 15 CLEARED
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 w-full mb-3">
                        {/* Team Name */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="bg-primary/5 border border-primary/20 p-2 rounded flex flex-col items-center justify-center relative group hover:bg-primary/10 transition-colors col-span-2"
                        >
                            <div className="flex items-center gap-2 text-primary/70 mb-0.5 uppercase text-[10px] tracking-wider">
                                <Terminal className="w-3 h-3" />
                                Operative Team
                            </div>
                            <div className="text-base md:text-xl font-bold text-white break-words drop-shadow-md">
                                {displayTeamName}
                            </div>
                        </motion.div>

                        {/* Execution Time */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.3 }}
                            className="bg-primary/5 border border-primary/20 p-2 rounded flex flex-col items-center justify-center relative group hover:bg-primary/10 transition-colors col-span-2"
                        >
                            <div className="flex items-center gap-2 text-primary/70 mb-0.5 uppercase text-[10px] tracking-wider">
                                <Clock className="w-3 h-3" />
                                Execution Time
                            </div>
                            <div className="text-base md:text-xl font-bold text-white tabular-nums drop-shadow-md">
                                {timeTaken}
                            </div>
                        </motion.div>

                        {/* Agent 1 */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="bg-primary/5 border border-primary/20 p-2 rounded flex flex-col items-center justify-center relative group hover:bg-primary/10 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-primary/70 mb-0.5 uppercase text-[10px] tracking-wider">
                                <Shield className="w-3 h-3" />
                                Agent 1
                            </div>
                            <div className="text-sm md:text-base font-bold text-white break-all drop-shadow-md">
                                {agent1}
                            </div>
                        </motion.div>

                        {/* Agent 2 */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="bg-primary/5 border border-primary/20 p-2 rounded flex flex-col items-center justify-center relative group hover:bg-primary/10 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-primary/70 mb-0.5 uppercase text-[10px] tracking-wider">
                                <Shield className="w-3 h-3" />
                                Agent 2
                            </div>
                            <div className="text-sm md:text-base font-bold text-white break-all drop-shadow-md">
                                {agent2}
                            </div>
                        </motion.div>
                    </div>

                    {/* Data Payload Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="w-full bg-black/60 border border-primary/10 rounded p-2 mb-4 text-left space-y-0.5 relative overflow-hidden ring-1 ring-primary/20"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] border-b border-primary/20 pb-1 mb-1 tracking-widest">
                            <FileCheck className="w-3 h-3" />
                            <span>DATA EXFILTRATION LOG</span>
                        </div>
                        <div className="space-y-0.5 font-mono text-[9px] md:text-[10px] text-primary/80">
                            <div className="flex justify-between items-center bg-primary/5 px-2 py-0.5 rounded">
                                <span>{'>'} Decrypting...</span>
                                <span className="text-white font-bold">100%</span>
                            </div>
                            <div className="flex justify-between items-center bg-primary/5 px-2 py-0.5 rounded">
                                <span>{'>'} Bypassing...</span>
                                <span className="text-green-400 font-bold">SUCCESS</span>
                            </div>
                            <div className="flex justify-between items-center bg-primary/5 px-2 py-0.5 rounded">
                                <span>{'>'} Uploading...</span>
                                <span className="text-green-400 font-bold">COMPLETE</span>
                            </div>
                            <p className="text-white mt-1 animate-pulse pl-1">{'>'} STANDBY...</p>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full justify-center">
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.1 }}
                            onClick={() => alert("TIE BREAKER PROTOCOL INITIATED")}
                            className="flex-1 group relative px-3 py-2 bg-red-500/10 border border-red-500/50 text-red-500 font-bold text-xs md:text-sm tracking-wider hover:bg-red-500/20 transition-all rounded shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95"
                        >
                            <span className="flex items-center gap-1.5 relative z-10 justify-center">
                                <Swords className="w-4 h-4" />
                                TIE-BREAKER
                            </span>
                        </motion.button>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.2 }}
                            onClick={onReset}
                            className="flex-1 group relative px-3 py-2 bg-primary text-black font-bold text-xs md:text-sm tracking-wider hover:bg-primary/90 transition-all rounded shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95"
                        >
                            <span className="flex items-center gap-1.5 relative z-10 justify-center">
                                <LogOut className="w-4 h-4" />
                                TERMINATE
                            </span>
                        </motion.button>
                    </div>

                    <div className="mt-4 text-[10px] text-primary/30 tracking-widest uppercase font-mono">
                        Session Terminated // End of Line
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
