import { useEffect, useState } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { UsersTable } from "../components/users/UsersTable";
import { UserForm } from "../components/users/UserForm";
import * as userService from "../services/user.service";
import { useAuthStore } from "../stores/auth.store";
import type { User } from "../types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const currentUser = useAuthStore((s) => s.user);
  const role = currentUser?.role || null;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      console.debug("UsersPage.load -> calling getUsers");
      const data = await userService.getUsers();
      console.debug("UsersPage.load -> getUsers returned", data);
      // normalize common API shapes: array, { data: [...] }, { users: [...] }
      const list = Array.isArray(data)
        ? data
        : data && Array.isArray((data as any).data)
        ? (data as any).data
        : data && Array.isArray((data as any).users)
        ? (data as any).users
        : [];
      if (!Array.isArray(list)) {
        console.error("Unexpected users response shape:", data);
      }
      setUsers(list);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload: { name: string; email: string; role: string; password?: string }) {
    try {
      await userService.createUser(payload);
      setShowForm(false);
      load();
    } catch (e: any) {
      alert(e.message || "Create failed");
    }
  }

  async function handleUpdate(payload: { name: string; email: string; role: string }) {
    if (!editing) return;
    try {
      await userService.updateUser(editing.id, payload);
      setEditing(null);
      setShowForm(false);
      load();
    } catch (e: any) {
      alert(e.message || "Update failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    try {
      await userService.deleteUser(id);
      load();
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Users</h2>
                <p className="text-sm text-slate-500">Manage application users and roles.</p>
              </div>

              {role === "admin" && (
                <div>
                  <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
                    New User
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-destructive">{error}</div>
            ) : (
              <UsersTable users={users} onEdit={(u) => { setEditing(u); setShowForm(true); }} onDelete={handleDelete} currentRole={role} />
            )}

            {showForm && (
              <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
                <div className="relative w-full max-w-lg bg-white rounded-xl p-6 shadow-xl z-10">
                  <h3 className="text-lg font-semibold mb-4">{editing ? "Edit user" : "Create user"}</h3>
                  <UserForm
                    initial={editing || undefined}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                    onSubmit={(payload) => {
                      if (editing) {
                        handleUpdate({ name: payload.name, email: payload.email, role: payload.role });
                      } else {
                        handleCreate(payload);
                      }
                    }}
                    submitLabel={editing ? "Update" : "Create"}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
