import { useState, useEffect } from 'react';
import Switch from './ThemeToggle'; // Assuming Switch is in a separate file

function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) {
                return saved === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true; // Default to dark mode
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <div className="bg-background p-4 text-text shadow-md flex justify-between items-center">
            <h1 className="text-3xl font-bold">NapTrack</h1>
            <Switch onClick={toggleTheme} isDarkMode={isDarkMode} />
        </div>
    );
}

export default Navbar;