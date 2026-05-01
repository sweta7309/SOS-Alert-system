import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      setErrors({ general: result.error || "Invalid credentials" });
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.info("Password reset is handled server-side. Contact support if needed.");
    setShowForgot(false);
    setForgotEmail("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8 space-y-4">
            <div className="inline-block p-4 rounded-full bg-gradient-emergency">
              <Shield className="h-8 w-8 text-emergency-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Vitalink Safety account</p>
          </div>

          {showForgot ? (
            <Card className="p-6 md:p-8 animate-fade-in">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Reset Password</h2>
                <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <Button onClick={handleForgotPassword} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Reset Link
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>
                  Back to Login
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 md:p-8 animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
                      placeholder="john@example.com"
                      className={errors.email ? "border-destructive" : form.email && !errors.email ? "border-success" : ""}
                    />
                    {form.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                    )}
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({}); }}
                      placeholder="••••••"
                      className={errors.password ? "border-destructive" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>
                </p>
              </form>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
