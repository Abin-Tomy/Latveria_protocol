import { useState, useEffect, useRef } from 'react';
import { Terminal, File, Trash, X } from 'lucide-react';
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import BookReveal from '@/components/BookReveal';
import { AnswerInput } from '@/components/AnswerInput';

// Constants
const DECOY_IMAGES = [
    '/dr-doom-latest.png',
    '/download.jpg',
    '/morse-code.jpeg',
    '/intro-bg.png',
    '/dr-doom-4k.png',
    '/dr-doom-4k-removebg-preview.png',
    '/placeholder.svg',
    '/advengers-poster.webp',
    '/burn-the-witch-poster.webp',
    '/crossfire-poster.webp',
    '/EFOOTBALL-poster.webp',
    '/IDEATHON-poster.webp',
    '/jarvis-poster.webp',
    '/latveria-protocol-poster.webp',
    '/QUIZbit-poster.webp',
    '/reelmaking-poster.webp',
    '/ROBORACE-poster.webp',
    '/star-of-envi-poster.webp',
    '/14th -level.png',
    '/still-room.jpg',
    '/WhatsApp Image 2026-01-29 at 11.20.01.jpeg',
];

interface DesktopPuzzleProps {
    puzzle: {
        question: string;
        answer: string;
    };
    onCorrectAnswer: () => void;
    onWrongAnswer: () => void;
    level?: number;
}

interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'bin';
    content?: string;
}

interface ClickZone {
    x: number; // percentage
    y: number; // percentage
    w: number; // percentage
    h: number; // percentage
    content: string;
    isTarget: boolean;
}

const DesktopPuzzle = ({ puzzle, onCorrectAnswer, onWrongAnswer, level = 5 }: DesktopPuzzleProps) => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [openFile, setOpenFile] = useState<FileItem | null>(null);
    const [showLibrary, setShowLibrary] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);

    // Book Reveal State
    const [bookReveal, setBookReveal] = useState<{ isOpen: boolean; content: string; isTarget: boolean; startPos: { x: number; y: number } }>({
        isOpen: false,
        content: '',
        isTarget: false,
        startPos: { x: 0, y: 0 }
    });

    const libraryRef = useRef<HTMLDivElement>(null);

    // Initialize files
    useEffect(() => {
        const fileNames = [
            'sys_log.txt', 'dump_01', 'temp_x', 'check garbage bin',
            'y_data', 'garbage bin', 'user_a', 'cache_v',
            'bin_check', 'system_check', 'x_files', 'config'
        ];

        const posterImages = [
            '/advengers-poster.webp',
            '/burn-the-witch-poster.webp',
            '/crossfire-poster.webp',
            '/EFOOTBALL-poster.webp',
            '/IDEATHON-poster.webp',
            '/jarvis-poster.webp',
            '/latveria-protocol-poster.webp',
            '/QUIZbit-poster.webp',
            '/reelmaking-poster.webp',
            '/ROBORACE-poster.webp',
            '/star-of-envi-poster.webp',
        ];

        let posterIndex = 0;

        const newFiles: FileItem[] = fileNames.map((name, index) => ({
            id: `file-${index}`,
            name: name,
            type: name.includes('garbage bin') && name !== 'check garbage bin' ? 'bin' : 'file',
            content: name === 'garbage bin'
                ? '/boy-library.jpeg'
                : posterImages[posterIndex++]
        }));

        setFiles(newFiles);
    }, []);

    const handleSolve = async (val: string): Promise<boolean> => {
        // Check for 'GATWAY' (from the book) or 'ABIN' (from original puzzle)
        const userAnswer = val.toUpperCase().trim();
        if (userAnswer === 'GATWAY' || userAnswer === 'ABIN') {
            setSolved(true);
            setFeedback("ARCHIVAL MATCH CONFIRMED. INFORMATION RECOVERED.");
            setTimeout(() => {
                onCorrectAnswer();
            }, 1000);
            return true;
        } else {
            setFeedback("IRRELEVANT DATA.\nCONTINUE SEARCH.");
            onWrongAnswer();
            return false;
        }
    };

    const handleFileClick = (file: FileItem) => {
        if (file.type === 'bin') {
            setShowLibrary(true);
        } else {
            setOpenFile(file);
        }
    };

    const handleLibraryClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!libraryRef.current) return;

        const rect = libraryRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Define zones based on the provided image description
        // Navy blue book is in the bookshelf on the LEFT side
        // Specifically in the upper-middle shelves

        let clickedZone: ClickZone | null = null;

        // Target Zone: Navy blue book in the bookshelf
        // Left side bookshelf: X: 0-30%, Navy blue books are around Y: 20-45%
        if (x < 30 && y > 20 && y < 45) {
            clickedZone = { x, y, w: 0, h: 0, content: 'GATWAY', isTarget: true };
        }
        // No decoy zone - only the navy blue book can be clicked

        if (clickedZone) {
            setBookReveal({
                isOpen: true,
                content: clickedZone.content,
                isTarget: clickedZone.isTarget,
                startPos: { x: e.clientX, y: e.clientY }
            });
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
                        <span className="text-primary/90 font-semibold">KNOWLEDGE LOCATION TEST</span>
                    </div>

                    <div className="glass-card p-3 md:p-4 rounded-sm flex flex-col gap-3 border border-primary/10">
                        {/* Text Section */}
                        <div className="text-foreground flex-shrink-0 text-left space-y-1">
                            <p className="text-xs md:text-sm font-medium tracking-wide">
                                {puzzle.question}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desktop Environment */}
                <div className="relative border border-primary/30 rounded-md overflow-hidden bg-[#000000] flex-1 min-h-[300px] shadow-[0_0_30px_rgba(0,0,0,0.5)] mt-3">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(0, 50, 255, 0.1) 0%, transparent 20%), 
                                         radial-gradient(circle at 90% 80%, rgba(255, 0, 50, 0.1) 0%, transparent 20%)`
                        }}
                    />

                    {/* Files Grid */}
                    <div className="grid grid-cols-4 gap-4 p-6 relative z-10 selection:bg-transparent overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-green-500/10 hover:scrollbar-thumb-green-400">
                        {files.map((file, index) => {
                            // Different professional Windows-style icons
                            const getFileIcon = () => {
                                if (file.type === 'bin') {
                                    // Windows 10 style Recycle Bin
                                    return (
                                        <div className="w-16 h-16 relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                                <defs>
                                                    <linearGradient id="recycleBin" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" style={{ stopColor: '#E8F4FC' }} />
                                                        <stop offset="50%" style={{ stopColor: '#B8D8F0' }} />
                                                        <stop offset="100%" style={{ stopColor: '#6AAEE7' }} />
                                                    </linearGradient>
                                                    <filter id="shadow">
                                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                                                    </filter>
                                                </defs>
                                                {/* Bin body */}
                                                <path d="M16 24 L20 56 Q20 58 22 58 L42 58 Q44 58 44 56 L48 24 Z" fill="url(#recycleBin)" filter="url(#shadow)" />
                                                {/* Bin top rim */}
                                                <rect x="14" y="20" width="36" height="6" rx="1" fill="#4A90E2" opacity="0.9" />
                                                {/* Recycling arrows */}
                                                <path d="M28 35 L30 30 L32 35 M30 30 L30 42" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                                                <path d="M36 35 Q38 37 36 40 Q34 37 36 35" fill="white" />
                                                <path d="M24 38 Q22 36 24 33 Q26 36 24 38" fill="white" />
                                                {/* Highlight */}
                                                <ellipse cx="38" cy="28" rx="4" ry="3" fill="white" opacity="0.4" />
                                            </svg>
                                        </div>
                                    );
                                }

                                // Windows-style file icons
                                const iconVariants = [
                                    // Notepad Text File
                                    <div key="notepad" className="w-16 h-16 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                            <defs>
                                                <linearGradient id="paper" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#FFFFFF' }} />
                                                    <stop offset="100%" style={{ stopColor: '#E8E8E8' }} />
                                                </linearGradient>
                                            </defs>
                                            <path d="M14 8 L42 8 L50 16 L50 56 L14 56 Z" fill="url(#paper)" stroke="#B0B0B0" strokeWidth="1" />
                                            <path d="M42 8 L42 16 L50 16" fill="#D0D0D0" stroke="#B0B0B0" strokeWidth="1" />
                                            <line x1="20" y1="24" x2="44" y2="24" stroke="#4A90E2" strokeWidth="1.5" />
                                            <line x1="20" y1="30" x2="44" y2="30" stroke="#4A90E2" strokeWidth="1.5" />
                                            <line x1="20" y1="36" x2="38" y2="36" stroke="#4A90E2" strokeWidth="1.5" />
                                            <line x1="20" y1="42" x2="44" y2="42" stroke="#B0B0B0" strokeWidth="1" />
                                            <line x1="20" y1="48" x2="35" y2="48" stroke="#B0B0B0" strokeWidth="1" />
                                        </svg>
                                    </div>,

                                    // Classic Yellow Folder
                                    <div key="folder" className="w-16 h-16 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                            <defs>
                                                <linearGradient id="folderTop" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#FFEB3B' }} />
                                                    <stop offset="100%" style={{ stopColor: '#FBC02D' }} />
                                                </linearGradient>
                                                <linearGradient id="folderBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#FBC02D' }} />
                                                    <stop offset="100%" style={{ stopColor: '#F57F17' }} />
                                                </linearGradient>
                                            </defs>
                                            {/* Folder back */}
                                            <path d="M8 20 L8 52 Q8 54 10 54 L54 54 Q56 54 56 52 L56 22 Q56 20 54 20 Z" fill="url(#folderBottom)" />
                                            {/* Folder tab */}
                                            <path d="M8 20 L8 16 Q8 14 10 14 L24 14 L28 18 L54 18 Q56 18 56 20 L56 22 L8 22 Z" fill="url(#folderTop)" />
                                            {/* Highlight */}
                                            <ellipse cx="46" cy="24" rx="8" ry="4" fill="white" opacity="0.2" />
                                            {/* Shadow */}
                                            <path d="M10 52 L54 52" stroke="#C6A700" strokeWidth="1" opacity="0.5" />
                                        </svg>
                                    </div>,

                                    // Code/Script File (green)
                                    <div key="script" className="w-16 h-16 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                            <defs>
                                                <linearGradient id="scriptFile" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#81C784' }} />
                                                    <stop offset="100%" style={{ stopColor: '#388E3C' }} />
                                                </linearGradient>
                                            </defs>
                                            <path d="M14 8 L42 8 L50 16 L50 56 L14 56 Z" fill="url(#scriptFile)" stroke="#2E7D32" strokeWidth="1" />
                                            <path d="M42 8 L42 16 L50 16" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
                                            <text x="22" y="35" fill="white" fontSize="16" fontFamily="Consolas, monospace" fontWeight="bold">&lt;/&gt;</text>
                                            <circle cx="20" cy="44" r="2" fill="#C8E6C9" />
                                            <circle cx="28" cy="44" r="2" fill="#C8E6C9" />
                                            <circle cx="36" cy="44" r="2" fill="#C8E6C9" />
                                        </svg>
                                    </div>,

                                    // Database File (blue cylinder)
                                    <div key="database" className="w-16 h-16 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                            <defs>
                                                <linearGradient id="dbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#64B5F6' }} />
                                                    <stop offset="100%" style={{ stopColor: '#1976D2' }} />
                                                </linearGradient>
                                                <radialGradient id="dbTop">
                                                    <stop offset="0%" style={{ stopColor: '#90CAF9' }} />
                                                    <stop offset="100%" style={{ stopColor: '#42A5F5' }} />
                                                </radialGradient>
                                            </defs>
                                            <ellipse cx="32" cy="18" rx="18" ry="8" fill="url(#dbTop)" stroke="#1565C0" strokeWidth="1" />
                                            <path d="M14 18 L14 28 Q14 32 32 32 Q50 32 50 28 L50 18" fill="url(#dbGrad)" stroke="#1565C0" strokeWidth="1" />
                                            <ellipse cx="32" cy="28" rx="18" ry="4" fill="#1976D2" opacity="0.3" />
                                            <path d="M14 28 L14 38 Q14 42 32 42 Q50 42 50 38 L50 28" fill="url(#dbGrad)" stroke="#1565C0" strokeWidth="1" />
                                            <ellipse cx="32" cy="38" rx="18" ry="4" fill="#1976D2" opacity="0.3" />
                                            <path d="M14 38 L14 48 Q14 52 32 52 Q50 52 50 48 L50 38" fill="url(#dbGrad)" stroke="#1565C0" strokeWidth="1" />
                                            <ellipse cx="32" cy="48" rx="18" ry="4" fill="#0D47A1" />
                                        </svg>
                                    </div>,

                                    // Settings/Config File (gear)
                                    <div key="settings" className="w-16 h-16 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                            <defs>
                                                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#FFB74D' }} />
                                                    <stop offset="100%" style={{ stopColor: '#F57C00' }} />
                                                </linearGradient>
                                                <radialGradient id="gearCenter">
                                                    <stop offset="0%" style={{ stopColor: '#FFF3E0' }} />
                                                    <stop offset="100%" style={{ stopColor: '#FFB74D' }} />
                                                </radialGradient>
                                            </defs>
                                            <circle cx="32" cy="32" r="24" fill="url(#gearGrad)" stroke="#E65100" strokeWidth="1" />
                                            {/* Gear teeth */}
                                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                                const rad = (angle * Math.PI) / 180;
                                                const x = 32 + 24 * Math.cos(rad);
                                                const y = 32 + 24 * Math.sin(rad);
                                                return <circle key={i} cx={x} cy={y} r="3" fill="#E65100" />;
                                            })}
                                            <circle cx="32" cy="32" r="14" fill="url(#gearCenter)" stroke="#E65100" strokeWidth="1" />
                                            <circle cx="32" cy="32" r="6" fill="#E65100" />
                                            <ellipse cx="28" cy="26" rx="3" ry="2" fill="white" opacity="0.4" />
                                        </svg>
                                    </div>,

                                    // Archive/Zip File (compressed)
                                    <div key="zip" className="w-16 h-16 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
                                            <defs>
                                                <linearGradient id="zipFile" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#BA68C8' }} />
                                                    <stop offset="100%" style={{ stopColor: '#7B1FA2' }} />
                                                </linearGradient>
                                            </defs>
                                            <path d="M14 8 L42 8 L50 16 L50 56 L14 56 Z" fill="url(#zipFile)" stroke="#4A148C" strokeWidth="1" />
                                            <path d="M42 8 L42 16 L50 16" fill="#9C27B0" stroke="#4A148C" strokeWidth="1" />
                                            {/* Zipper */}
                                            <rect x="28" y="12" width="8" height="3" fill="#E1BEE7" />
                                            <rect x="30" y="15" width="4" height="3" fill="#CE93D8" />
                                            <rect x="28" y="18" width="8" height="3" fill="#E1BEE7" />
                                            <rect x="30" y="21" width="4" height="3" fill="#CE93D8" />
                                            <rect x="28" y="24" width="8" height="3" fill="#E1BEE7" />
                                            {/* Zipper pull */}
                                            <circle cx="32" cy="38" r="6" fill="#FFD54F" stroke="#F57F17" strokeWidth="1" />
                                            <circle cx="32" cy="38" r="3" fill="#4A148C" />
                                        </svg>
                                    </div>,
                                ];

                                return iconVariants[index % iconVariants.length];
                            };

                            return (
                                <div
                                    key={file.id}
                                    onClick={() => handleFileClick(file)}
                                    className="flex flex-col items-center justify-center p-2 gap-2 cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                                >
                                    <div className="relative transform transition-transform group-hover:scale-110">
                                        {getFileIcon()}
                                    </div>
                                    <span className="text-[10px] text-white/90 font-sans text-center break-all px-2 py-1 group-hover:text-white group-hover:bg-blue-500/80 rounded transition-colors max-w-full">
                                        {file.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-4 mt-auto p-4 z-20 relative">
                <AnswerInput
                    onSubmit={handleSolve}
                    successMessage={"ARCHIVAL MATCH CONFIRMED.\nINFORMATION RECOVERED.\nLAYER 05 BREACHED."}
                    errorMessage={feedback}
                    withExecuteButton
                    feedbackPlacement="top"
                    disabled={solved}
                    placeholder="ENTER DECRYPTION KEY..."
                />
            </div>

            {/* Decoy File Modal */}
            <Dialog open={!!openFile} onOpenChange={(open) => !open && setOpenFile(null)}>
                <DialogContent className="bg-black/95 border-primary p-0 max-w-3xl overflow-hidden">
                    <DialogHeader className="p-4 border-b border-primary/30 flex flex-row items-center justify-between">
                        <DialogTitle className="text-primary font-mono flex items-center gap-2">
                            <File className="w-4 h-4" />
                            {openFile?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-0 bg-zinc-900/50 flex items-center justify-center min-h-[400px]">
                        {openFile?.content && (
                            <img
                                src={openFile.content}
                                alt="File Content"
                                className="max-w-[80vw] max-h-[60vh] md:max-w-[500px] md:max-h-[500px] object-contain shadow-2xl opacity-80"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Library Interaction Modal (Full Screen Overlay) */}
            {showLibrary && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl aspect-video bg-black border border-primary/20 shadow-2xl overflow-hidden rounded-lg">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowLibrary(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div
                            ref={libraryRef}
                            className="w-full h-full relative cursor-default"
                            onClick={handleLibraryClick}
                        >
                            <img
                                src="/boy-library.jpeg"
                                alt="Library Archive"
                                className="w-full h-full object-contain pointer-events-none"
                            />

                            {/* Invisible Click Zones Visualization (Dev only - remove opacity in prod) */}
                            {/* <div className="absolute top-0 left-0 w-[35%] h-full bg-red-500/20 pointer-events-none" /> */}
                            {/* <div className="absolute top-[60%] left-[60%] w-[25%] h-[30%] bg-green-500/20 pointer-events-none" /> */}
                        </div>

                        {/* Hint Text */}
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                            <span className="bg-black/80 px-4 py-2 text-primary/50 text-xs font-mono uppercase tracking-widest border border-primary/10 rounded-full">
                                ARCHIVE VIEW // SEARCH ACTIVE
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Reveal Animation */}
            <BookReveal
                isOpen={bookReveal.isOpen}
                onClose={() => setBookReveal(prev => ({ ...prev, isOpen: false }))}
                content={bookReveal.content}
                isTarget={bookReveal.isTarget}
                startPos={bookReveal.startPos}
            />
        </div>
    );
};

export default DesktopPuzzle;
