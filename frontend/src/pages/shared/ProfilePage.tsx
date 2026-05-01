import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff,
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Card, Button, Input, FormField, Badge } from "../../components/ui";
import { authService } from "../../services/auth.service";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

export default function ProfilePage() {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Security credentials updated successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-black text-text-main uppercase tracking-tighter">My Identity</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2 italic">
          Account Governance & Security Parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* PROFILE CARD */}
        <Card className="md:col-span-1 p-8 text-center bg-white border-none shadow-xl shadow-brand-accent/5">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-brand-primary flex items-center justify-center border-4 border-white shadow-lg overflow-hidden group">
              <User className="h-12 w-12 text-brand-accent" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-brand-accent text-white rounded-xl shadow-lg border-2 border-white">
              <Shield size={14} />
            </div>
          </div>
          
          <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{user?.name}</h2>
          <Badge className="mt-2 bg-brand-primary text-brand-accent border-brand-accent/20 uppercase tracking-widest text-[9px] px-3 py-1">
            {activeRole || (user?.roles?.[0] || user?.role || 'STUDENT').toUpperCase()}
          </Badge>

          <div className="mt-8 space-y-4 text-left">
            <div className="p-4 bg-brand-primary/30 rounded-2xl border border-transparent hover:border-brand-border transition-all">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-brand-accent" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Email Node</span>
              </div>
              <p className="text-xs font-bold text-text-main mt-1 truncate">{user?.email}</p>
            </div>
            
            <div className="p-4 bg-brand-primary/30 rounded-2xl border border-transparent hover:border-brand-border transition-all">
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-brand-accent" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">System Status</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-xs font-bold text-text-main uppercase tracking-tight">Active Sync</p>
              </div>
            </div>
          </div>
        </Card>

        {/* SECURITY SETTINGS */}
        <Card className="md:col-span-2 p-8 md:p-10 border-none bg-white shadow-xl shadow-brand-accent/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <Lock size={120} />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
              <KeyRound size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-main uppercase tracking-tight">Security Protocol</h3>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Update Authorization Credentials</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <FormField label="Current Access Key" required>
              <div className="relative">
                <Input 
                  type={showPass.current ? "text" : "password"}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="pr-12"
                  placeholder="Enter current password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass({...showPass, current: !showPass.current})}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-accent transition-colors"
                >
                  {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="New Sync Token" required>
                <div className="relative">
                  <Input 
                    type={showPass.new ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    className="pr-12"
                    placeholder="Min. 6 characters"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass({...showPass, new: !showPass.new})}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-accent transition-colors"
                  >
                    {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm New Key" required>
                <div className="relative">
                  <Input 
                    type={showPass.confirm ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className="pr-12"
                    placeholder="Repeat new password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-accent transition-colors"
                  >
                    {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="p-4 bg-brand-primary/20 rounded-2xl border border-brand-border/50 flex gap-4">
              <div className="shrink-0 text-brand-accent">
                <AlertTriangle size={20} />
              </div>
              <p className="text-[10px] font-bold text-text-muted uppercase leading-relaxed tracking-widest italic">
                Modifying your access key will invalidate existing sessions. Ensure your new credentials comply with system security standards.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 uppercase tracking-widest font-black text-xs shadow-lg shadow-brand-accent/20"
              disabled={loading}
            >
              {loading ? "Synchronizing..." : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  Update Credentials
                </div>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
