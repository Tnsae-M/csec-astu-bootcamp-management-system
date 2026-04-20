import { useState, useEffect } from "react";
import type { User } from "../../types";

type Props = {
  initial?: User;
  onSubmit: (data: {
    name: string;
    email: string;
    role: string;
    password?: string;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
};

export function UserForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Create",
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setEmail(initial.email || "");
      setRole(initial.role || "student");
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      name,
      email,
      role,
      password: initial ? undefined : password,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* HEADER */}
      <div className="border-b pb-3">
        <h2 className="text-lg font-semibold text-slate-800">
          {initial ? "Edit User" : "Create New User"}
        </h2>
        <p className="text-sm text-slate-500">
          Fill in the details below to manage system users
        </p>
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm font-medium text-slate-700">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter full name"
          required
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email"
          required
        />
      </div>

      {/* ROLE */}
      <div>
        <label className="text-sm font-medium text-slate-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* PASSWORD (only for create) */}
      {!initial && (
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create password"
            required
          />
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 pt-3 border-t">

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border text-sm font-medium
                     hover:bg-slate-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 shadow-sm hover:shadow-md
                     active:scale-95 transition-all"
        >
          {submitLabel}
        </button>

      </div>
    </form>
  );
}