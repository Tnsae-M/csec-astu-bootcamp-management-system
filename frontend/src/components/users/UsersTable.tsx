import type { User } from "../../types";
import { Fragment } from "react";

type Props = {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
  currentRole: string | null;
};

export function UsersTable({ users, onEdit, onDelete, currentRole }: Props) {
  if (!Array.isArray(users)) {
    return <div className="p-6 text-sm text-slate-600">Unexpected data format for users.</div>;
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full table-auto">
        <thead className="bg-slate-50 text-left text-sm">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 w-44">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-3 text-sm">{u.name}</td>
              <td className="px-4 py-3 text-sm">{u.email}</td>
              <td className="px-4 py-3 text-sm capitalize">{u.role}</td>
              <td className="px-4 py-3 text-sm capitalize">{u.status || "active"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(u)} className="px-3 py-1 rounded-md border text-sm">
                    Edit
                  </button>
                  {currentRole === "admin" && (
                    <button onClick={() => onDelete(u.id)} className="px-3 py-1 rounded-md bg-destructive text-white text-sm">
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <div className="p-4 text-sm text-slate-500">No users found.</div>}
    </div>
  );
}
