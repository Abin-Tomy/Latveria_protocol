import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TeamSetup = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState("");
    const [agent1, setAgent1] = useState("");
    const [agent2, setAgent2] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Load saved team data on mount & enforce login
    useEffect(() => {
        const savedTeam = sessionStorage.getItem("lockstep_team");
        if (!savedTeam) {
            // Not logged in -> Redirect to Login
            navigate("/");
            return;
        }

        try {
            const parsed = JSON.parse(savedTeam);
            // Login.tsx saves as { teamId, currentLevel, startTime }
            // Support both teamId (new login) and teamName (legacy)
            const name = parsed.teamId || parsed.teamName;
            if (name) {
                setTeamName(name);
            }
        } catch (e) {
            console.error("Failed to parse saved team", e);
            navigate("/");
        }
    }, [navigate]);

    // Real-time validation
    useEffect(() => {
        const newErrors: { [key: string]: string } = {};

        if (agent1.trim() && agent1.length < 2) {
            newErrors.agent1 = "Agent ID must be at least 2 characters";
        }
        if (agent2.trim() && agent2.length < 2) {
            newErrors.agent2 = "Agent ID must be at least 2 characters";
        }
        setErrors(newErrors);
    }, [agent1, agent2]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const isFormValid =
            teamName.trim().length >= 2 &&
            agent1.trim().length >= 2 &&
            agent2.trim().length >= 2 &&
            Object.keys(errors).length === 0;

        if (!isFormValid) {
            if (!agent1.trim()) setErrors(prev => ({ ...prev, agent1: "AGENT ID REQUIRED" }));
            if (!agent2.trim()) setErrors(prev => ({ ...prev, agent2: "AGENT ID REQUIRED" }));
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to session storage (frontend only)
            const savedTeam = sessionStorage.getItem("lockstep_team");
            if (savedTeam) {
                const parsed = JSON.parse(savedTeam);
                parsed.agent1 = agent1.trim();
                parsed.agent2 = agent2.trim();
                sessionStorage.setItem("lockstep_team", JSON.stringify(parsed));

                // Also set a separate cookie/item if needed, but session object is enough
            } else {
                // Fallback if session is missing (shouldn't happen due to useEffect check)
                sessionStorage.setItem("lockstep_team", JSON.stringify({
                    teamId: teamName,
                    agent1: agent1.trim(),
                    agent2: agent2.trim(),
                    startTime: new Date().toISOString()
                }));
            }

            setShowSuccess(true);

            // Delay for animation
            setTimeout(() => {
                navigate("/doomsday");
            }, 1500);

        } catch (err) {
            console.error("Agent save failed", err);
            setErrors({
                submit: "STORAGE ERROR - RETRY"
            });
            setIsSubmitting(false);
        }
    };

    const renderFieldStatus = (fieldName: string, value: string) => {
        if (!value) return null;
        if (errors[fieldName]) return <AlertCircle className="w-4 h-4 text-red-400" />;
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 font-['Press_Start_2P'] bg-background transition-colors duration-500 relative overflow-hidden">
            {/* Background - Same as Intro */}
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

            {/* Main Container - Game Boy Style */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", damping: 25 }}
                className="relative w-full max-w-2xl bg-card border-8 border-primary/40 rounded-lg shadow-2xl overflow-hidden z-10 glow-primary"
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{ backgroundImage: "url('/intro-bg.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col p-6 md:p-12 space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-4 text-center"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow-[0_0_8px_rgba(0,255,100,0.5)]" />
                            </motion.div>
                            <h1 className="text-lg md:text-3xl text-primary tracking-widest uppercase font-bold drop-shadow-lg">
                                Agent Registration
                            </h1>
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow-[0_0_8px_rgba(0,255,100,0.5)]" />
                            </motion.div>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-xs md:text-sm text-primary/70 uppercase tracking-wider"
                        >
                            Assemble your team to begin
                        </motion.p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Team Name */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-xs md:text-sm text-primary/80 uppercase tracking-wider font-semibold">
                                    Team Name
                                </label>
                                {renderFieldStatus("teamName", teamName)}
                            </div>
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === "teamName"
                                        ? "0 0 15px rgba(0, 255, 100, 0.4), inset 0 0 15px rgba(0, 255, 100, 0.1)"
                                        : "0 0 0px rgba(0, 255, 100, 0)"
                                }}
                                className="relative"
                            >
                                <Input
                                    type="text"
                                    placeholder="IDENTITY LOCKED"
                                    value={teamName}
                                    readOnly={true}
                                    className={`bg-black/60 border-2 text-primary/70 placeholder:text-muted-foreground/50 text-xs md:text-sm focus:outline-none transition-all uppercase tracking-wide border-primary/20 cursor-not-allowed select-none`}
                                />
                            </motion.div>
                            <AnimatePresence>
                                {errors.teamName && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[10px] md:text-xs text-red-400"
                                    >
                                        ✗ {errors.teamName}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Agent 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-xs md:text-sm text-primary/80 uppercase tracking-wider font-semibold">
                                    Agent 1
                                </label>
                                {renderFieldStatus("agent1", agent1)}
                            </div>
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === "agent1"
                                        ? "0 0 15px rgba(0, 255, 100, 0.4), inset 0 0 15px rgba(0, 255, 100, 0.1)"
                                        : "0 0 0px rgba(0, 255, 100, 0)"
                                }}
                                className="relative"
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter name..."
                                    value={agent1}
                                    onChange={(e) => setAgent1(e.target.value)}
                                    onFocus={() => setFocusedField("agent1")}
                                    onBlur={() => setFocusedField(null)}
                                    className={`bg-black/40 border-2 text-foreground placeholder:text-muted-foreground/50 text-xs md:text-sm focus:outline-none transition-all uppercase tracking-wide ${errors.agent1
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-primary/30 focus:border-primary"
                                        }`}
                                    disabled={isSubmitting}
                                />
                            </motion.div>
                            <AnimatePresence>
                                {errors.agent1 && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[10px] md:text-xs text-red-400"
                                    >
                                        ✗ {errors.agent1}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Agent 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-xs md:text-sm text-primary/80 uppercase tracking-wider font-semibold">
                                    Agent 2
                                </label>
                                {renderFieldStatus("agent2", agent2)}
                            </div>
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === "agent2"
                                        ? "0 0 15px rgba(0, 255, 100, 0.4), inset 0 0 15px rgba(0, 255, 100, 0.1)"
                                        : "0 0 0px rgba(0, 255, 100, 0)"
                                }}
                                className="relative"
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter name..."
                                    value={agent2}
                                    onChange={(e) => setAgent2(e.target.value)}
                                    onFocus={() => setFocusedField("agent2")}
                                    onBlur={() => setFocusedField(null)}
                                    className={`bg-black/40 border-2 text-foreground placeholder:text-muted-foreground/50 text-xs md:text-sm focus:outline-none transition-all uppercase tracking-wide ${errors.agent2
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-primary/30 focus:border-primary"
                                        }`}
                                    disabled={isSubmitting}
                                />
                            </motion.div>
                            <AnimatePresence>
                                {errors.agent2 && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[10px] md:text-xs text-red-400"
                                    >
                                        ✗ {errors.agent2}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Progress Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-1 justify-center pt-2"
                        >
                            {[teamName, agent1, agent2].map((field, i) => (
                                <motion.div
                                    key={i}
                                    className={`h-2 w-8 rounded transition-all ${field.trim() && !errors[["teamName", "agent1", "agent2"][i]]
                                        ? "bg-green-500"
                                        : field.trim()
                                            ? "bg-red-500"
                                            : "bg-muted-foreground/30"
                                        }`}
                                    animate={{
                                        scale: field.trim() ? [1, 1.1, 1] : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            <Button
                                type="submit"
                                disabled={!teamName || !agent1 || !agent2 || isSubmitting}
                                className={`w-full text-black text-xs md:text-sm font-['Press_Start_2P'] uppercase tracking-widest py-6 md:py-8 transition-all ${(teamName && agent1 && agent2 && !isSubmitting)
                                    ? "bg-primary hover:bg-primary/90 cursor-pointer shadow-[0_0_15px_rgba(0,255,100,0.3)]"
                                    : "bg-muted-foreground/30 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <motion.span
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        Registering...
                                    </motion.span>
                                ) : (
                                    "Start Mission"
                                )}
                            </Button>
                        </motion.div>

                        <AnimatePresence>
                            {errors.submit && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center text-red-500 text-xs mt-2 uppercase tracking-wider"
                                >
                                    ⚠ {errors.submit}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Footer Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center space-y-2 border-t-2 border-primary/20 pt-6"
                    >
                        <p className="text-[8px] md:text-[10px] text-primary/60 tracking-wide">
                            Team information will be saved for your mission
                        </p>
                        <p className="text-[8px] md:text-[10px] text-primary/40">
                            All fields must be completed to proceed
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Success Animation Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-6"
                            >
                                <Shield className="w-full h-full text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-primary text-lg md:text-2xl font-['Press_Start_2P'] uppercase tracking-widest"
                            >
                                Registration Complete
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-primary/60 text-xs md:text-sm mt-4 uppercase"
                            >
                                Redirecting to mission...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamSetup;
