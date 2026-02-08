import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimerProps {
  startTime: Date;
}

export const Timer = ({ startTime }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState("03:00:00");
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const TIME_LIMIT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  const ALERT_INTERVALS = [
    { time: 30 * 60 * 1000, message: "30 MINUTES REMAINING!" },
    { time: 15 * 60 * 1000, message: "15 MINUTES REMAINING!" },
    { time: 5 * 60 * 1000, message: "5 MINUTES REMAINING!" },
    { time: 1 * 60 * 1000, message: "1 MINUTE REMAINING!" },
  ];

  useEffect(() => {
    const alertShown = new Set<number>();

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const remaining = TIME_LIMIT - elapsed;

      // Check for alerts
      ALERT_INTERVALS.forEach((alert) => {
        if (remaining <= alert.time && remaining > alert.time - 1000 && !alertShown.has(alert.time)) {
          setAlertMessage(alert.message);
          setShowAlert(true);
          alertShown.add(alert.time);
          setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
        }
      });

      if (remaining <= 0) {
        setIsTimeOver(true);
        // Continue counting into negative
        const negativeTime = Math.abs(remaining);
        const hours = Math.floor(negativeTime / 3600000);
        const minutes = Math.floor((negativeTime % 3600000) / 60000);
        const seconds = Math.floor((negativeTime % 60000) / 1000);
        
        setTimeRemaining(
          `-${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 font-mono ${isTimeOver ? 'text-red-500' : 'text-muted-foreground'}`}>
        <Clock className="w-4 h-4" />
        <span className="text-sm tracking-wider">{timeRemaining}</span>
        {isTimeOver && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-['Press_Start_2P'] text-red-500 ml-2"
          >
            TIME OVER
          </motion.span>
        )}
      </div>

      {/* Yellow Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 left-0 right-0 bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 px-4 py-2 rounded flex items-center gap-2 font-['Press_Start_2P'] text-[10px] whitespace-nowrap z-50"
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
