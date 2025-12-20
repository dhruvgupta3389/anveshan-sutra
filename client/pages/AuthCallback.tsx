import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/services/auth";

/**
 * Auth Callback Handler
 * Handles:
 * - OAuth redirects from Google/LinkedIn
 * - Magic link token verification from email
 */
export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    const returnTo = searchParams.get("returnTo") || "/";

    useEffect(() => {
        const handleCallback = async () => {
            try {
                if (!supabase) {
                    setError("Authentication service not configured");
                    setStatus("error");
                    return;
                }

                // For magic links, Supabase automatically parses the token from URL hash
                // detectSessionInUrl: true in supabase config handles this

                // Wait a moment for Supabase to process the URL hash
                await new Promise(resolve => setTimeout(resolve, 100));

                // Get the session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("Auth callback session error:", sessionError);
                    setError(sessionError.message);
                    setStatus("error");
                    return;
                }

                if (session) {
                    // Successfully authenticated
                    setStatus("success");

                    // Ensure user profile exists (for new OAuth users)
                    try {
                        const { user } = await getCurrentUser();
                        if (user) {
                            // Create profile if it doesn't exist in database
                            const { data: existingProfile } = await supabase
                                .from('user_profiles')
                                .select('id')
                                .eq('id', session.user.id)
                                .single();

                            if (!existingProfile) {
                                // Create new profile for OAuth user
                                await supabase.from('user_profiles').insert({
                                    id: session.user.id,
                                    email: session.user.email,
                                    name: session.user.user_metadata?.full_name ||
                                        session.user.user_metadata?.name ||
                                        session.user.email?.split('@')[0] || '',
                                    role: 'ngo', // Default role, user can change later
                                    profile_complete: false,
                                    verified: true, // OAuth users are verified
                                });
                            }
                        }
                    } catch (profileErr) {
                        console.warn("Profile check/create error (non-fatal):", profileErr);
                    }

                    // Short delay to show success state
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Redirect to intended destination
                    navigate(decodeURIComponent(returnTo), { replace: true });
                } else {
                    // No session - check URL for error
                    const errorParam = searchParams.get("error");
                    const errorDescription = searchParams.get("error_description");

                    if (errorParam) {
                        setError(errorDescription || errorParam);
                        setStatus("error");
                    } else {
                        // No session and no error - go back to auth
                        setError("No session found. Please try signing in again.");
                        setStatus("error");
                    }
                }
            } catch (err: any) {
                console.error("Callback error:", err);
                setError(err.message || "Authentication failed. Please try again.");
                setStatus("error");
            }
        };

        handleCallback();
    }, [navigate, returnTo, searchParams]);

    if (status === "error") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-2xl p-8 max-w-md text-center">
                    <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-5">
                        <AlertCircle className="w-7 h-7 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                        Authentication Failed
                    </h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/auth")}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-foreground font-medium">Signed in successfully!</p>
                    <p className="text-muted-foreground text-sm mt-1">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
