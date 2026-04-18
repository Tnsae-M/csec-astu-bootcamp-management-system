import { Card } from "../components/ui/card";
import { Sidebar } from "../components/ui/Sidebar";
import { useAuthStore } from "../stores/auth.store";

export default function BootcampsPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <Card className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Bootcamp Management
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                Bootcamps
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                View and manage bootcamp programs in one place. 
              </p>
            </Card>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                <p className="text-sm text-slate-500">Total Bootcamps</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">--</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                <p className="text-sm text-slate-500">Active Bootcamps</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">--</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                <p className="text-sm text-slate-500">Upcoming Intakes</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">--</p>
              </Card>
            </div>

            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-slate-900">
                Bootcamp List
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Bootcamp records will appear here after backend bootcamp endpoints
                are connected.
              </p>
              <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No bootcamps available yet.
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
