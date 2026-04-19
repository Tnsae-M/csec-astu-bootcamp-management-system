import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useAuthStore } from "../stores/auth.store";
import * as divisionService from "../services/division.service";

export default function DivisionsPage() {
  const user = useAuthStore((state) => state.user);
  const [divisions, setDivisions] = useState<divisionService.DivisionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  const isAdmin = Array.isArray(user.role)
    ? user.role.includes("admin")
    : user.role === "admin";

  const loadDivisions = async (nameFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await divisionService.getDivisions({
        name: nameFilter?.trim() || undefined,
      });
      setDivisions(Array.isArray(response.data) ? response.data : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load divisions.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDivisions();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = { name: name.trim(), description: description.trim() };
      if (editingId) {
        await divisionService.updateDivision(editingId, payload);
      } else {
        await divisionService.createDivision(payload);
      }

      resetForm();
      setIsModalOpen(false);
      await loadDivisions(search);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save division.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (division: divisionService.DivisionDto) => {
    setEditingId(division._id);
    setName(division.name || "");
    setDescription(division.description || "");
    setIsModalOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this division?")) return;

    setError(null);
    try {
      await divisionService.deleteDivision(id);
      if (editingId === id) resetForm();
      await loadDivisions(search);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete division.",
      );
    }
  };

  const filteredCountText = useMemo(() => {
    if (!search.trim()) return `${divisions.length} total`;
    return `${divisions.length} matching`;
  }, [divisions.length, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <Card className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Admin Panel
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                Divisions
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage divisions that organize your bootcamp structure.
              </p>
            </Card>

            {error && (
              <Card className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                {error}
              </Card>
            )}

            <div className="space-y-6">
              <div
                className={isAdmin ? "cursor-pointer" : ""}
                onClick={() => {
                  if (isAdmin) openCreateModal();
                }}
              >
                <Card
                  className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-md ${
                    isAdmin ? "hover:border-slate-300 hover:shadow-lg" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Create Division
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {isAdmin
                          ? "Click this card to open the create-division form."
                          : "Only admins can create or edit divisions."}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openCreateModal();
                        }}
                        className="bg-linear-to-r from-darkblue-600 to-blue-600 hover:from-darkblue-700 hover:to-blue-600 text-white"
                      >
                        New Division
                      </Button>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Division Records
                    </h2>
                    <p className="text-sm text-slate-600">
                      {filteredCountText}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by name"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => loadDivisions(search)}
                      disabled={loading}
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="mt-5 rounded-xl border border-slate-200 p-6 text-slate-500">
                    Loading divisions...
                  </div>
                ) : divisions.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-slate-200 p-6 text-slate-500">
                    No divisions found.
                  </div>
                ) : (
                  <Table className="mt-5">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {divisions.map((division) => (
                        <TableRow key={division._id}>
                          <TableCell className="font-semibold">
                            {division.name}
                          </TableCell>
                          <TableCell>
                            {division.description || "No description"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                disabled={!isAdmin}
                                onClick={() => onEdit(division)}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                disabled={!isAdmin}
                                onClick={() => onDelete(division._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Division" : "Create Division"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Division Name</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. School of Computing"
                required
                disabled={!isAdmin || submitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional description"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                rows={4}
                disabled={!isAdmin || submitting}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!isAdmin || submitting}
                className="bg-linear-to-r from-darkblue-600 to-blue-600 hover:from-darkblue-700 hover:to-blue-600 text-white"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Division"
                    : "Create Division"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
