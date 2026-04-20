import type { User } from "../../types";

type Props = {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
  currentRole: string | null;
};

export function UsersTable({ users, onEdit, onDelete, currentRole }: Props) {
  if (!Array.isArray(users)) {
    return (
      <div className="p-6 text-sm text-slate-600">
        Unexpected data format for users.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <table className="w-full table-auto">
        {/* HEADER */}
        <thead className="bg-slate-50 text-left text-sm text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold w-48">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="bg-white">
          {users.map((u) => (
            <tr key={u._id} className="border-t hover:bg-slate-50 transition">
              <td className="px-4 py-3 text-sm">{u.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
              <td className="px-4 py-3 text-sm capitalize">{u.role}</td>
              <td className="px-4 py-3 text-sm capitalize">
                {u.status || "active"}
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">

                  {/* ✏️ EDIT BUTTON */}
                  <button
                    onClick={() => onEdit(u)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md 
                               border border-slate-300 text-slate-700 text-sm font-medium
                               hover:bg-slate-100 hover:border-slate-400
                               active:scale-95 transition-all duration-200"
                  >
                    ✏️ Edit
                  </button>

                  {/* 🗑 DELETE BUTTON */}
                  {currentRole === "admin" && (
                    <button
                      onClick={() => onDelete(u._id)}   // ✅ FIXED HERE
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md 
                                 bg-red-500 text-white text-sm font-medium
                                 hover:bg-red-600 hover:shadow-md
                                 active:scale-95 transition-all duration-200"
                    >
                      🗑 Delete
                    </button>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {users.length === 0 && (
        <div className="p-6 text-sm text-slate-500 text-center">
          No users found
        </div>
      )}
    </div>
  );
}