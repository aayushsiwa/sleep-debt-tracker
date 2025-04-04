import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "./auth-context";

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginInstead: () => void;
}

export default function SignupModal({
    isOpen,
    onClose,
    onLoginInstead,
}: SignupModalProps) {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim()
        ) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setIsLoading(true);
            await register(
                name,
                email,
                password,
            );
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create account. Please try again."
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
                    className="absolute top-4 right-4 text-secondary hover:text-text"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-text">
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-900/30 border border-accent text-accent px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-secondary mb-1"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-secondary text-text border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="signup-email"
                            className="block text-sm font-medium text-secondary mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-secondary text-text border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="signup-password"
                            className="block text-sm font-medium text-secondary mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-secondary text-text border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-secondary mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-secondary text-text border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-text py-2 px-4 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary disabled:opacity-70 flex items-center justify-center mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin mr-2"
                                />
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary">
                    Already have an account?{" "}
                    <button
                        onClick={onLoginInstead}
                        className="text-accent hover:underline"
                    >
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
}