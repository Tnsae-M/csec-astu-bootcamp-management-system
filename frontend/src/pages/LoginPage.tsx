import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../stores/auth.store";
import { Lock, Mail } from "lucide-react";
import bgImg from "../assets/csec-logo.jpg";

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
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="relative flex h-80 items-center justify-center overflow-hidden bg-slate-900 lg:h-auto">
          <img
            src={bgImg}
            alt="CSEC ASTU bootcamp"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-950/80 via-slate-900/70 to-slate-800/40" />
          <div className="relative z-10 max-w-xl px-8 text-center text-white sm:px-12 lg:text-left">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-200/70">
              CSEC ASTU
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-4xl">
              Bootcamp Management Made Easy
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 max-w-md">
              Keep students, instructors, schedules, and progress organized in
              one intelligent dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <Card className="space-y-6 p-8 bg-white/95 shadow-2xl rounded-2xl border border-slate-200">
              <div className="space-y-2 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Bootcamp Management
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Sign in to CSEC ASTU
                </h2>
                <p className="text-sm text-slate-600">
                  Use your email and password to access your bootcamp dashboard.
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

                <Button
                  className="w-full bg-linear-to-r from-darkblue-600 to-blue-600 hover:from-darkblue-700 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  type="submit"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
