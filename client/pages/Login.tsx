import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check, Copy, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Ambient Background Elements (Consistent with Signup) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="flex-grow pt-32 pb-24 px-4 z-10 relative flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 border border-border/20 p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your Drivya.AI account
              </p>
            </div>

            <form className="space-y-6">
              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                  Email Address
                </label>
                <div
                  className={`relative transition-all duration-300 ${
                    focusedField === "email" ? "scale-[1.01]" : ""
                  }`}
                >
                  <Mail
                    className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${
                      focusedField === "email"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                  Password
                </label>
                <div
                  className={`relative transition-all duration-300 ${
                    focusedField === "password" ? "scale-[1.01]" : ""
                  }`}
                >
                  <Lock
                    className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${
                      focusedField === "password"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 border-2 border-border rounded peer-checked:bg-primary peer-checked:border-primary transition-all" />
                    <Check className="w-3 h-3 text-primary-foreground absolute left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/90 hover:underline underline-offset-2 transition-all"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">
                  or
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button className="w-full py-3 px-4 bg-card border border-border text-foreground rounded-xl hover:bg-secondary/10 hover:border-border transition-all duration-200 font-medium flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:text-primary/90 hover:underline transition-all"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Demo Credentials - Interactive & Animated */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-xl p-5"
          >
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Copy className="w-4 h-4 text-primary" />
              Demo Credentials
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-mono text-sm text-foreground">demo@annvesha.org</p>
                </div>
                <button
                  onClick={() => copyToClipboard("demo@Drivya.AI", "email")}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  {copiedField === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
              
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm text-muted-foreground">Password</p>
                  <p className="font-mono text-sm text-foreground">DemoPass123!</p>
                </div>
                <button
                  onClick={() => copyToClipboard("DemoPass123!", "password")}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  {copiedField === "password" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              For demonstration purposes only
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}