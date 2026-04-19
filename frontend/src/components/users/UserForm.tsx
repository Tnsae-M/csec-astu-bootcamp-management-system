import { useEffect, useState } from "react";

type Props = {
  initial?: { id?: string; name?: string; email?: string; role?: string } | null;
  onCancel: () => void;
  onSubmit: (data: { name: string; email: string; role: string; password?: string }) => void;
  submitLabel?: string;
};

export function UserForm({ initial = null, onCancel, onSubmit, submitLabel = "Save" }: Props) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [role, setRole] = useState(initial?.role || "student");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(initial?.name || "");
    setEmail(initial?.email || "");
    setRole(initial?.role || "student");
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    onSubmit({ name, email, role, password: password || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      {!initial && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
          <p className="text-xs text-slate-500 mt-1">Set an initial password for the new user.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2">
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border text-sm">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
