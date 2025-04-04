import { useAuth } from "./auth-context";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import UserProfile from "./UserProfile"; // Import UserProfile
import { useState, useRef, useEffect } from "react";
import {
    CircleUserRound,
    EllipsisVertical,
    LogOut,
    Settings,
    User,
    X,
} from "lucide-react";

function Sidebar() {
    const { isAuthenticated, userId, logout } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // New state for profile modal
    const menuRef = useRef<HTMLDivElement>(null);

    const handleOpenLoginModal = () => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
        }
    };

    const handleOpenProfile = () => {
        setIsProfileOpen(true);
        setIsMenuOpen(false); // Close the dropdown menu when opening profile
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => {
                    setIsLoginModalOpen(false);
                    setIsMenuOpen(false);
                }}
                onSignupInstead={() => {
                    setIsLoginModalOpen(false);
                    setIsSignupModalOpen(true);
                }}
            />
            <SignupModal
                isOpen={isSignupModalOpen}
                onClose={() => {
                    setIsSignupModalOpen(false);
                    setIsMenuOpen(false);
                }}
                onLoginInstead={() => {
                    setIsSignupModalOpen(false);
                    setIsLoginModalOpen(true);
                }}
            />
            {/* Profile Modal */}
            {isProfileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsProfileOpen(false)}
                            className="absolute top-4 right-4 text-primary hover:scale-125"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                        <UserProfile />
                    </div>
                </div>
            )}
            <aside className="w-64 bg-secondary bg-opacity-10 p-4 rounded-lg flex flex-col border border-primary border-opacity-20">
                {/* User profile section */}
                <div>
                    <div className="flex gap-3 pt-4 items-center relative">
                        <div className="bg-background rounded-full p-1">
                            <CircleUserRound className="text-accent h-6 w-6" />
                        </div>

                        {isAuthenticated ? (
                            <>
                                <span className="text-text font-medium truncate">
                                    {userId}
                                </span>
                                <div className="relative ml-auto" ref={menuRef}>
                                    <button
                                        onClick={() =>
                                            setIsMenuOpen(!isMenuOpen)
                                        }
                                        className="text-text hover:text-text transition p-1 rounded-md hover:bg-accent hover:bg-opacity-10"
                                        aria-label="User options"
                                    >
                                        <EllipsisVertical className="h-5 w-5" />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute top-full left-full mb-2 bg-background rounded-md shadow-lg w-48 py-1 z-10">
                                            <button
                                                onClick={handleOpenProfile}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text hover:bg-accent hover:text-text transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text hover:bg-accent hover:text-text transition-colors">
                                                <Settings className="h-4 w-4" />
                                                <span>Settings</span>
                                            </button>
                                            <div className="border-t border-primary my-1"></div>
                                            <button
                                                onClick={logout}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-primary italic">
                                    Coolest User
                                </span>
                                <button
                                    onClick={handleOpenLoginModal}
                                    className="ml-auto text-accent hover:text-primary transition text-sm font-medium"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;