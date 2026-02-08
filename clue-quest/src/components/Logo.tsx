import { motion } from "framer-motion";

export const Logo = ({ size = "default" }: { size?: "default" | "small" }) => {
  const isSmall = size === "small";
  
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`relative ${isSmall ? "w-6 h-6" : "w-8 h-8"}`}>
        <div className="absolute inset-0 border-2 border-primary rotate-45" />
        <div className="absolute inset-1 border border-primary/50 rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${isSmall ? "w-1.5 h-1.5" : "w-2 h-2"} bg-primary rounded-full animate-pulse`} />
        </div>
      </div>
      <span className={`font-mono font-bold tracking-[0.3em] text-primary text-glow ${isSmall ? "text-sm" : "text-xl"}`}>
        LOCKSTEP
      </span>
    </motion.div>
  );
};
