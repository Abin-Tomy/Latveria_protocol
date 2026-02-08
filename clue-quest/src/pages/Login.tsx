import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const [teamId, setTeamId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Load saved credentials from localStorage on mount
    useEffect(() => {
        const savedCreds = localStorage.getItem("lockstep_credentials");
        if (savedCreds) {
            try {
                const { teamId: savedTeamId, password: savedPassword } = JSON.parse(savedCreds);
                setTeamId(savedTeamId || "");
                setPassword(savedPassword || "");
            } catch (err) {
                console.error("Failed to load saved credentials", err);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamId.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        setIsLoading(true);
        setError("");

        // Simulate loading delay
        setTimeout(() => {
            // Mock authentication - accept any credentials

            // Save credentials to localStorage for future logins
            localStorage.setItem("lockstep_credentials", JSON.stringify({
                teamId: teamId,
                password: password
            }));

            // Store team info in localStorage (persists across browser refresh)
            localStorage.setItem("lockstep_team", JSON.stringify({
                teamId: teamId,
                currentLevel: 1,
                startTime: new Date().toISOString()
            }));
            navigate("/intro");
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 noise opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

            {/* Decorative grid */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px"
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-12">
                    <Logo />
                </div>

                {/* Login Card */}
                <div className="border border-border rounded-lg bg-card/80 backdrop-blur-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-lg font-mono uppercase tracking-[0.2em] text-foreground mb-2">
                            Team Registration
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Enter your team details to begin
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    value={teamId}
                                    onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                                    placeholder="YOUR TEAM NAME"
                                    className="w-full px-4 py-3 bg-input border border-border rounded-md font-mono text-sm tracking-wider uppercase placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:glow-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-input border border-border rounded-md font-mono text-sm tracking-wider placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:glow-primary transition-all"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-destructive text-sm"
                            >
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary text-primary-foreground font-mono font-semibold uppercase tracking-widest rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 glow-primary"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Registering
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Register
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    One device per team • Good luck!
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
