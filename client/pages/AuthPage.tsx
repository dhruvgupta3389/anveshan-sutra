import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type AuthState = "idle" | "loading" | "success" | "error";

/**
 * Unified Auth Page
 * Supports Email Magic Link (OTP), Google OAuth, and LinkedIn OAuth
 * No password-based authentication
 */
export default function AuthPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [authState, setAuthState] = useState<AuthState>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const returnTo = searchParams.get("returnTo") || "/";

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate(decodeURIComponent(returnTo), { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate, returnTo]);

    // Handle Email Magic Link
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setErrorMessage("Please enter a valid email address");
            setAuthState("error");
            return;
        }

        if (!supabase) {
            setErrorMessage("Authentication service not configured");
            setAuthState("error");
            return;
        }

        setAuthState("loading");
        setErrorMessage("");

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
                },
            });

            if (error) {
                console.error("Magic link error:", error);
                setErrorMessage(error.message);
                setAuthState("error");
                return;
            }

            setAuthState("success");
        } catch (err: any) {
            console.error("Auth error:", err);
            setErrorMessage(err.message || "Failed to send magic link");
            setAuthState("error");
        }
    };

    // Handle Google OAuth
    const handleGoogleSignIn = async () => {
        if (!supabase) {
            setErrorMessage("Authentication service not configured");
            setAuthState("error");
            return;
        }

        setAuthState("loading");

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
                },
            });

            if (error) {
                console.error("Google OAuth error:", error);
                setErrorMessage(error.message);
                setAuthState("error");
            }
        } catch (err: any) {
            console.error("Google auth error:", err);
            setErrorMessage(err.message || "Failed to sign in with Google");
            setAuthState("error");
        }
    };

    // Handle LinkedIn OAuth
    const handleLinkedInSignIn = async () => {
        if (!supabase) {
            setErrorMessage("Authentication service not configured");
            setAuthState("error");
            return;
        }

        setAuthState("loading");

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "linkedin_oidc",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
                },
            });

            if (error) {
                console.error("LinkedIn OAuth error:", error);
                setErrorMessage(error.message);
                setAuthState("error");
            }
        } catch (err: any) {
            console.error("LinkedIn auth error:", err);
            setErrorMessage(err.message || "Failed to sign in with LinkedIn");
            setAuthState("error");
        }
    };

    // Loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <Header />

            <main className="flex-grow pt-32 pb-24 px-4 z-10 relative flex items-center justify-center">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 border border-border/20 p-8 md:p-10"
                    >
                        <AnimatePresence mode="wait">
                            {authState === "success" ? (
                                /* Success State */
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-3">
                                        Check your email
                                    </h2>
                                    <p className="text-muted-foreground mb-4">
                                        We sent a magic link to
                                    </p>
                                    <p className="font-medium text-foreground mb-6">
                                        {email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Click the link in your email to sign in.
                                        <br />
                                        No password needed.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setAuthState("idle");
                                            setEmail("");
                                        }}
                                        className="mt-6 text-sm text-primary hover:underline"
                                    >
                                        Use a different email
                                    </button>
                                </motion.div>
                            ) : (
                                /* Login Form */
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="text-center mb-8">
                                        <h1 className="text-3xl font-bold text-foreground mb-2">
                                            Sign in to Drivya.AI
                                        </h1>
                                        <p className="text-muted-foreground">
                                            Access detailed matches, alignment insights, and organization data.
                                        </p>
                                    </div>

                                    {/* Error Message */}
                                    {authState === "error" && errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3"
                                        >
                                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-destructive">{errorMessage}</p>
                                        </motion.div>
                                    )}

                                    {/* Email Magic Link Form */}
                                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    disabled={authState === "loading"}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={authState === "loading"}
                                            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:transform-none"
                                        >
                                            {authState === "loading" ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Send Magic Link
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <p className="text-xs text-muted-foreground text-center mt-3">
                                        We use passwordless login. Enter your email to continue securely.
                                    </p>

                                    {/* Divider */}
                                    <div className="relative my-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-card text-muted-foreground font-medium">
                                                or continue with
                                            </span>
                                        </div>
                                    </div>

                                    {/* Social Login Buttons - Disabled until configured */}
                                    <div className="space-y-3">
                                        {/* Google Button - Coming Soon */}
                                        <div className="relative group">
                                            <button
                                                disabled
                                                className="w-full py-3 px-4 bg-card border border-border text-muted-foreground rounded-xl font-medium flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24">
                                                    <path
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                        fill="#9CA3AF"
                                                    />
                                                    <path
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        fill="#9CA3AF"
                                                    />
                                                    <path
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                        fill="#9CA3AF"
                                                    />
                                                    <path
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        fill="#9CA3AF"
                                                    />
                                                </svg>
                                                Google — Coming soon
                                            </button>
                                        </div>

                                        {/* LinkedIn Button - Coming Soon */}
                                        <div className="relative group">
                                            <button
                                                disabled
                                                className="w-full py-3 px-4 bg-card border border-border text-muted-foreground rounded-xl font-medium flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24" fill="#9CA3AF">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                                LinkedIn — Coming soon
                                            </button>
                                        </div>
                                    </div>

                                    {/* Trust message */}
                                    <p className="text-xs text-muted-foreground text-center mt-8">
                                        By continuing, you agree to our{" "}
                                        <Link to="/terms-and-conditions" className="text-primary hover:underline">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy-policy" className="text-primary hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
