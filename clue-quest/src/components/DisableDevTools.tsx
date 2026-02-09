import { useEffect } from 'react';

/**
 * Component to disable developer tools, right-click, and keyboard shortcuts
 * This helps prevent users from inspecting the application or refreshing during gameplay
 */
export const DisableDevTools = () => {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12 (DevTools)
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+S (Save)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                return false;
            }

            // Disable F5 (Refresh)
            if (e.key === 'F5') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+R (Refresh)
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+R (Hard Refresh)
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+F5 (Hard Refresh)
            if (e.ctrlKey && e.key === 'F5') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+H (History)
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+A (Select All)
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+P (Print)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+F (Find)
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                return false;
            }
        };

        // Disable select/copy
        const handleSelectStart = (e: Event) => {
            e.preventDefault();
            return false;
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            return false;
        };

        const handleCut = (e: ClipboardEvent) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);

        // Detect if DevTools is open
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                // DevTools detected - could show warning or redirect
                console.clear();
            }
        };

        // Check for DevTools periodically
        const devToolsInterval = setInterval(detectDevTools, 1000);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            clearInterval(devToolsInterval);
        };
    }, []);

    return null; // This component doesn't render anything
};
