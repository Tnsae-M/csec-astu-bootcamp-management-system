import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../stores/auth.store";
import { Lock, Mail } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/auth-success", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/auth-success", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <Card className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Bootcamp Management
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Sign in to your account
            </h1>
            <p className="text-sm text-slate-600">
              Use your email and password to continue.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2 text-slate-900">
                <Mail className="h-4 w-4" /> Email
              </span>
              <Input
                type="email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
                placeholder="name@example.com"
                required
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2 text-slate-900">
                <Lock className="h-4 w-4" /> Password
              </span>
              <Input
                type="password"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
