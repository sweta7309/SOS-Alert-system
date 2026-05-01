import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Lock, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) { toast.error("Enter a valid 10-digit number"); return; }
    setLoading(true);
    
    await updateProfile(form);
    toast.success("Profile Updated Successfully!");
    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) { toast.error("Minimum 6 characters required"); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error("Passwords do not match"); return; }
    
    const result = await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
    if (result.success) {
      toast.success("Password Changed Successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(result.error || "Failed to change password");
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          {/* Profile Info */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><CheckCircle className="mr-2 h-4 w-4" /> Update Profile</>}
              </Button>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-warning/10">
                <Lock className="h-6 w-6 text-warning" />
              </div>
              <h2 className="text-xl font-semibold">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>New Password (min 6 chars)</Label>
                <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
              </div>
              <Button type="submit" variant="outline" className="w-full">Change Password</Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
