import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, Phone, User, Delete, Terminal } from "lucide-react";

interface PhoneKeypadPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

const ANSWER = "SHAKTHIMAN";
const DIAL_KEY = "7777442558444446266";
const HINT = "Look for someone who doesn't belong in this universe...";

// Contact list - Marvel characters + one DC character (Batman hidden in middle)
const contacts = [
    { name: "Iron Man", phone: "476-6626" },
    { name: "Spider-Man", phone: "774-3376" },
    { name: "Thor", phone: "846-7000" },
    { name: "Hulk", phone: "485-5000" },
    { name: "Black Widow", phone: "252-2594" },
    { name: "Captain America", phone: "227-8246" },
    { name: "Hawkeye", phone: "429-5393" },
    { name: "Black Panther", phone: "252-2572" },
    { name: "Doctor Strange", phone: "362-8787" },
    { name: "Ant-Man", phone: "268-6260" },
    { name: "Scarlet Witch", phone: "722-7538" },
    { name: "Vision", phone: "847-4660" },
    { name: "Falcon", phone: "325-2660" },
    { name: "War Machine", phone: "927-6224" },
    { name: "Shakthiman", phone: "983-5127" },
    { name: "Star-Lord", phone: "782-7567" },
    { name: "Gamora", phone: "426-672" },
    { name: "Groot", phone: "476-6800" },
    { name: "Rocket", phone: "762-538" },
    { name: "Drax", phone: "372-9000" },
    { name: "Nebula", phone: "632-852" },
    { name: "Loki", phone: "565-4000" },
    { name: "Thanos", phone: "842-667" },
    { name: "Wolverine", phone: "965-8374" },
    { name: "Deadpool", phone: "332-3766" },
    { name: "Storm", phone: "786-7600" },
    { name: "Cyclops", phone: "292-5677" },
    { name: "Jean Grey", phone: "532-6473" },
    { name: "Magneto", phone: "624-6386" },
    { name: "Professor X", phone: "776-3000" }
];

// Convert letter to multi-tap phone sequence
const letterToMultiTap = (letter: string): string => {
    const upperLetter = letter.toUpperCase();
    for (const [num, data] of Object.entries(keypadMap)) {
        const index = data.letters.indexOf(upperLetter);
        if (index !== -1) {
            // Repeat the number (index + 1) times for multi-tap
            return num.repeat(index + 1);
        }
    }
    return letter;
};

const convertToNumbers = (text: string): string => {
    return text.split('').map(letterToMultiTap).join('');
};

// Phone keypad mapping (old phone style)
const keypadMap: { [key: string]: { number: string; letters: string } } = {
    "1": { number: "1", letters: "" },
    "2": { number: "2", letters: "ABC" },
    "3": { number: "3", letters: "DEF" },
    "4": { number: "4", letters: "GHI" },
    "5": { number: "5", letters: "JKL" },
    "6": { number: "6", letters: "MNO" },
    "7": { number: "7", letters: "PQRS" },
    "8": { number: "8", letters: "TUV" },
    "9": { number: "9", letters: "WXYZ" },
    "*": { number: "*", letters: "" },
    "0": { number: "0", letters: " " },
    "#": { number: "#", letters: "" },
};

export const PhoneKeypadPuzzle = ({ onSolve, level = 8 }: PhoneKeypadPuzzleProps) => {
    const [input, setInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [currentKey, setCurrentKey] = useState<string | null>(null);
    const [keyPressCount, setKeyPressCount] = useState(0);
    const [lastKeyTime, setLastKeyTime] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const MULTI_TAP_DELAY = 800; // ms to wait before confirming letter

    // Prevent system keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            return false;
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleKeyPress = (key: string) => {
        if (solved) return;
        
        const keyData = keypadMap[key];
        if (!keyData || !keyData.letters) return;

        const now = Date.now();
        
        // Clear any pending timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (currentKey === key && now - lastKeyTime < MULTI_TAP_DELAY) {
            // Same key pressed within timeout - cycle through letters
            const newCount = (keyPressCount + 1) % keyData.letters.length;
            setKeyPressCount(newCount);
            
            // Update the last character in input
            const newInput = input.slice(0, -1) + keyData.letters[newCount];
            setInput(newInput);
        } else {
            // New key or timeout expired - add new letter
            setCurrentKey(key);
            setKeyPressCount(0);
            setInput(prev => prev + keyData.letters[0]);
        }
        
        setLastKeyTime(now);

        // Set timeout to confirm letter
        timeoutRef.current = setTimeout(() => {
            setCurrentKey(null);
            setKeyPressCount(0);
        }, MULTI_TAP_DELAY);
    };

    const handleDelete = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setInput(prev => prev.slice(0, -1));
        setCurrentKey(null);
        setKeyPressCount(0);
    };

    const handleClear = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setInput("");
        setCurrentKey(null);
        setKeyPressCount(0);
    };

    const handleSubmit = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setCurrentKey(null);
        
        const dialedNumber = convertToNumbers(input);
        if (dialedNumber === DIAL_KEY) {
            setSolved(true);
            setFeedback("✓ CORRECT! The outsider has been identified!");
            setInputError(false);
            setTimeout(() => {
                onSolve?.(ANSWER);
            }, 1500);
        } else {
            setInputError(true);
            setFeedback("✗ INCORRECT. That's not the outsider.");
            setTimeout(() => {
                setInputError(false);
                setFeedback("");
            }, 2000);
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
                        <span className="text-primary/90 font-semibold">PRIMITIVE COMMUNICATION</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">
                                You've just found a primitive comms device. Everyone you are familiar with is trapped. Both of you must find someone who is NOT acquainted with them.
                            </p>
                        </div>
                    </div>
                </div>

            {/* Main Interface Group */}
            <div className="flex-1 flex gap-3 min-h-0 overflow-hidden mt-3">
                {/* Left - Contact List */}
                <div 
                    className="w-1/2 flex flex-col rounded-lg overflow-hidden shrink-0"
                    style={{
                        background: 'linear-gradient(180deg, #9bbc0f 0%, #8bac0f 50%, #7b9c0f 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                        border: '3px solid #4a4a5a',
                    }}
                >
                    {/* Screen Header */}
                    <div className="flex justify-between items-center px-2 py-1 border-b border-gray-700/30">
                        <span className="text-[7px] text-gray-800">▋▋▋</span>
                        <span className="text-[8px] text-gray-800 font-bold">CONTACTS</span>
                        <span className="text-[7px] text-gray-800">12:00</span>
                    </div>
                    
                    {/* Contact List */}
                    <div 
                        className="flex-1 overflow-y-auto p-1"
                        style={{ 
                            fontFamily: 'Courier New, monospace',
                            scrollbarWidth: 'thin',
                        }}
                    >
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={contact.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className="flex justify-between items-center px-2 py-1.5 text-xs text-gray-900 border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                            >
                                <span className="font-bold truncate flex-1">{contact.name}</span>
                                <span className="text-[10px] ml-2">{contact.phone}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right - Old Phone with Keypad */}
                <div 
                    className="w-1/2 flex flex-col rounded-[20px] p-2"
                    style={{
                        background: 'linear-gradient(145deg, #2d2d3a 0%, #1a1a24 50%, #0d0d12 100%)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.3)',
                        border: '3px solid #3a3a4a',
                    }}
                >
                    {/* Phone Brand */}
                    <div className="text-center mb-1">
                        <span className="text-[12px] text-gray-500 tracking-[0.3em]" style={{ fontFamily: 'Arial, sans-serif' }}>NOKIA</span>
                    </div>

                    {/* Dial Display Screen */}
                    <div 
                        className="rounded-lg p-1.5 mb-2"
                        style={{
                            background: 'linear-gradient(180deg, #9bbc0f 0%, #8bac0f 50%, #7b9c0f 100%)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                            border: '2px solid #4a4a5a',
                        }}
                    >
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[7px] text-gray-800 font-bold">DIAL:</span>
                            <button
                                onClick={handleDelete}
                                className="p-0.5 hover:bg-gray-700/20 rounded transition-colors"
                            >
                                <Delete className="w-3 h-3 text-gray-800" />
                            </button>
                        </div>
                        <div 
                            className="text-center py-1 text-base font-bold text-gray-900 tracking-wider"
                            style={{ fontFamily: 'Courier New, monospace' }}
                        >
                            {input ? convertToNumbers(input) : "_"}
                            {currentKey && <span className="animate-pulse">|</span>}
                        </div>
                    </div>

                    {/* Physical Keypad */}
                    <div className="flex-1 grid grid-cols-3 gap-1 p-1">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleKeyPress(key)}
                                className={`relative flex flex-col items-center justify-center rounded-lg transition-all ${
                                    currentKey === key 
                                        ? 'bg-gray-400 shadow-inner' 
                                        : 'bg-gradient-to-b from-gray-300 to-gray-400 shadow-md hover:from-gray-200 hover:to-gray-300'
                                }`}
                                style={{
                                    minHeight: '36px',
                                    boxShadow: currentKey === key 
                                        ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
                                        : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
                                }}
                            >
                                <span className="text-[6px] text-gray-600 font-bold tracking-wider">
                                    {keypadMap[key]?.letters || (key === "*" ? "A→a" : key === "0" ? "OPER" : "")}
                                </span>
                                <span className="text-base md:text-lg font-bold text-gray-800">
                                    {key}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-1">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClear}
                            className="flex-1 py-1.5 rounded-full text-[8px] font-bold transition-colors"
                            style={{
                                background: 'linear-gradient(145deg, #4a4a5a 0%, #2a2a3a 100%)',
                                color: '#ff6b6b',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                        >
                            CLEAR
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            className="flex-1 py-1.5 rounded-full text-[8px] font-bold transition-colors"
                            style={{
                                background: 'linear-gradient(145deg, #4a4a5a 0%, #2a2a3a 100%)',
                                color: '#6bff6b',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                        >
                            CALL
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Hint Section */}
            <div className="mt-2 flex-shrink-0">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowHint(!showHint)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded text-[9px] text-primary transition-colors"
                >
                    <Lightbulb className="w-3 h-3" />
                    {showHint ? "HIDE HINT" : "NEED A HINT?"}
                </motion.button>

                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 p-2 bg-primary/10 border border-primary/30 rounded text-[9px] text-primary/80 leading-relaxed whitespace-pre-wrap text-center"
                        >
                            {HINT}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-2 p-2 border rounded text-center flex-shrink-0 ${
                            solved 
                                ? 'bg-green-900/30 border-green-500/50' 
                                : 'bg-red-900/30 border-red-500/50'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {solved ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                            ) : (
                                <XCircle className="w-3 h-3 text-red-400" />
                            )}
                            <span className={`text-[10px] font-bold ${solved ? 'text-green-400' : 'text-red-400'}`}>
                                {feedback}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
            
        </div>
    );
};

export default PhoneKeypadPuzzle;
