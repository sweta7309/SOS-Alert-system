import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Loader2, Plus, Trash2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EmergencyContact } from "@/lib/types";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "", phone: "", relation: "Police", priority: 1 },
    { id: "2", name: "", phone: "", relation: "Ambulance", priority: 2 },
    { id: "3", name: "", phone: "", relation: "Parent", priority: 3 },
    { id: "4", name: "", phone: "", relation: "Guardian", priority: 4 },
  ]);

  // Real-time validation
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.name && !formData.name.trim()) e.name = "Full name is required";
    if (touched.email) {
      if (!formData.email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter a valid email address";
    }
    if (touched.phone) {
      if (!formData.phone) e.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit number";
    }
    if (touched.password) {
      if (!formData.password) e.password = "Password is required";
      else if (formData.password.length < 6) e.password = "Minimum 6 characters required";
    }
    if (touched.confirmPassword) {
      if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    return e;
  }, [formData, touched]);

  const isStep1Valid = useMemo(
    () =>
      formData.name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      /^\d{10}$/.test(formData.phone.replace(/\D/g, "")) &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword,
    [formData]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleContactChange = (id: string, field: string, value: string) => {
    setEmergencyContacts(emergencyContacts.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const addContact = () => {
    if (emergencyContacts.length < 4) {
      setEmergencyContacts([
        ...emergencyContacts,
        { id: Date.now().toString(), name: "", phone: "", relation: "Other", priority: emergencyContacts.length + 1 },
      ]);
    }
  };

  const removeContact = (id: string) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    if (!isStep1Valid) return;
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validContacts = emergencyContacts.filter((c) => c.name && c.phone);
    if (validContacts.length === 0) {
      toast.error("Please add at least one emergency contact.");
      return;
    }
    for (const c of validContacts) {
      if (!/^\d{10}$/.test(c.phone.replace(/\D/g, ""))) {
        toast.error(`Invalid phone number for ${c.relation || c.name}`);
        return;
      }
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      emergencyContacts: validContacts,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Registration Successful! Welcome to Vitalink Safety.");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  const fieldIcon = (field: string, valid: boolean) => {
    if (!touched[field]) return null;
    return valid ? (
      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
    ) : (
      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
    );
  };

  const getBadgeColor = (relation: string) => {
    if (relation === "Police") return "bg-danger text-danger-foreground";
    if (relation === "Ambulance") return "bg-health text-health-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <div className="text-center mb-8 space-y-4">
            <div className="inline-block p-4 rounded-full bg-gradient-emergency">
              <Shield className="h-8 w-8 text-emergency-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Set up your emergency alert system in 2 simple steps</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`h-2 w-24 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 w-24 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>

          {step === 1 ? (
            <Card className="p-6 md:p-8 animate-fade-in">
              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Your data is stored securely in our database.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur("name")} placeholder="John Doe" className={errors.name ? "border-destructive pr-10" : touched.name && formData.name ? "border-success pr-10" : ""} />
                      {fieldIcon("name", !!formData.name.trim())}
                    </div>
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur("email")} placeholder="john@example.com" className={errors.email ? "border-destructive pr-10" : touched.email && !errors.email && formData.email ? "border-success pr-10" : ""} />
                      {fieldIcon("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))}
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number * (10 digits)</Label>
                    <div className="relative">
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur("phone")} placeholder="9876543210" className={errors.phone ? "border-destructive pr-10" : touched.phone && !errors.phone && formData.phone ? "border-success pr-10" : ""} />
                      {fieldIcon("phone", /^\d{10}$/.test(formData.phone.replace(/\D/g, "")))}
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, State ZIP" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password * (min 6 chars)</Label>
                    <div className="relative">
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} onBlur={() => handleBlur("password")} placeholder="••••••" className={errors.password ? "border-destructive pr-16" : touched.password && !errors.password && formData.password ? "border-success pr-16" : "pr-10"} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {touched.password && (formData.password.length >= 6 ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />)}
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} onBlur={() => handleBlur("confirmPassword")} placeholder="••••••" className={errors.confirmPassword ? "border-destructive pr-16" : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? "border-success pr-16" : "pr-10"} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {touched.confirmPassword && (formData.password === formData.confirmPassword && formData.confirmPassword ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />)}
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted-foreground hover:text-foreground">
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={!isStep1Valid}>
                  Continue to Emergency Contacts
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                </p>
              </form>
            </Card>
          ) : (
            <Card className="p-6 md:p-8 animate-fade-in">
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Emergency Contacts</h2>
                  <p className="text-sm text-muted-foreground">Add up to 4 priority contacts. They'll be notified via SMS in emergencies.</p>
                </div>

                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <Card key={contact.id} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getBadgeColor(contact.relation)}>Priority {index + 1}</Badge>
                          <span className="text-sm font-medium">{contact.relation}</span>
                        </div>
                        {emergencyContacts.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Relation</Label>
                          <Input value={contact.relation} onChange={(e) => handleContactChange(contact.id, "relation", e.target.value)} placeholder="e.g., Police" />
                        </div>
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={contact.name} onChange={(e) => handleContactChange(contact.id, "name", e.target.value)} placeholder="Contact name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone (10 digits)</Label>
                          <Input type="tel" value={contact.phone} onChange={(e) => handleContactChange(contact.id, "phone", e.target.value)} placeholder="9876543210" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {emergencyContacts.length < 4 && (
                  <Button type="button" variant="outline" className="w-full" onClick={addContact}>
                    <Plus className="h-4 w-4 mr-2" /> Add Another Contact
                  </Button>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up...</> : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
