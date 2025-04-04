import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "./auth-context";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignupInstead: () => void;
}

export default function LoginModal({
    isOpen,
    onClose,
    onSignupInstead,
}: LoginModalProps) {
    const { login } = useAuth();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!userId.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        try {
            setIsLoading(true);
            await login(userId, password);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed. Please check your credentials and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-primary hover:scale-125 transition-transform"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-text">Log In</h2>

                {error && (
                    <div className="bg-red-900/30 border border-accent text-accent px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="login-userId"
                            className="block text-sm font-medium text-primary mb-1"
                        >
                            User ID
                        </label>
                        <input
                            id="login-userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-secondary text-text border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Your user ID"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="login-password"
                            className="block text-sm font-medium text-primary mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-secondary text-text border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-secondary text-text py-2 px-4 rounded-md hover:bg-accent hover:text-secondary focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin mr-2"
                                />
                                Logging in...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-accent">
                    Don't have an account?{" "}
                    <button
                        onClick={onSignupInstead}
                        className="text-accent underline"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}
