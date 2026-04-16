import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuthStore } from "../stores/auth.store";

export function AuthSuccessPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 lg:px-10">
      <div className="mx-auto max-w-md">
        <Card className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome, {user.name}!
            </h1>
            <p className="text-sm text-slate-600">
              You are successfully logged in.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Name:</span>{" "}
                {user.name}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Role:</span>{" "}
                {user.role}
              </p>
            </div>

            <Button variant="secondary" onClick={logout} className="w-full">
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
