import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  Button,
  Modal,
  Card,
  Badge,
  EmptyState,
  FormField,
  Input,
  Textarea,
  Skeleton,
} from "@/components/ui";
import {
  Plus,
  Activity,
  BookOpen,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { bootcampsService } from "@/services/bootcamps.service";
import { enrollmentsService } from "@/services/enrollments.service";
import {
  fetchBootcampsByDivision,
  createBootcamp
} from "@/features/bootcamps/bootcampsSlice";

export default function BootcampsPage() {
  const { role, divisionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch() as any;

  const { bootcamps, loading } = useSelector(
    (state: RootState) => state.bootcamps,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER ADMIN");
  const isStudent = roles.includes("STUDENT");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });

  const fetchBootcampsList = () => {
    if (!divisionId) return;
    dispatch(fetchBootcampsByDivision(divisionId));
  };

  useEffect(() => {
    fetchBootcampsList();
  }, [divisionId, dispatch]);

  const filteredBootcamps = (bootcamps || []).filter(
    (b) =>
      (b.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (b.description &&
        b.description.toLowerCase().includes((searchTerm || "").toLowerCase())),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisionId) return;
    try {
      const result = await dispatch(createBootcamp({ divisionId, data: formData }));
      if (createBootcamp.fulfilled.match(result)) {
          toast.success("Bootcamp established successfully");
          setIsModalOpen(false);
          setFormData({ name: "", description: "", status: "ACTIVE" });
      } else {
          toast.error(result.payload as string || "Failed to create bootcamp");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create bootcamp");
    }
  };


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">
            Division Bootcamps
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">
            Program tracks and curriculum specialized for this unit
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shadow-lg shadow-brand-accent/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Program Track
          </Button>
        )}
      </div>

      {/* CONTENT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filteredBootcamps.length === 0 ? (
        <EmptyState
          title="No Bootcamps Found"
          description="This division currently has no active program tracks. Create one to begin curriculum delivery."
          icon={<BookOpen />}
          action={
            isAdmin
              ? {
                  label: "Create First Track",
                  onClick: () => setIsModalOpen(true),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBootcamps.map((bootcamp) => {
            const bId = bootcamp._id || bootcamp.id;
            return (
              <Card
                key={bId}
                className="group h-full overflow-visible border-none bg-white"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-brand-primary text-brand-accent shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                      <BookOpen size={24} />
                    </div>

                    <Badge className="uppercase tracking-widest text-[9px] px-2 bg-emerald-50 text-emerald-600 border-emerald-100">
                      {bootcamp.status || "ACTIVE"}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-text-main group-hover:text-brand-accent transition-colors leading-tight mb-2">
                    {bootcamp.name}
                  </h3>

                  <p className="text-sm text-text-muted line-clamp-2 mb-6">
                    {bootcamp.description ||
                      "Comprehensive training track focused on high-level technical mastery and collaboration."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between">
                    {isStudent ? (
                      <Button
                        onClick={async () => {
                          if (!divisionId || !bId) return;
                          try {
                            await enrollmentsService.createEnrollment({
                              bootcampId: bId,
                              divisionId,
                            });
                            toast.success("Enrolled successfully!");
                            navigate(
                              `/dashboard/${role}/divisions/${divisionId}/bootcamps/${bId}`,
                            );
                          } catch (err: any) {
                            toast.error(
                              err.response?.data?.message ||
                                "Enrollment failed",
                            );
                          }
                        }}
                        className="w-full justify-between group/btn bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                      >
                        Enroll Now
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button
                        className="w-full justify-between group/btn"
                        onClick={() =>
                          navigate(
                            `/dashboard/${role}/divisions/${divisionId}/bootcamps/${bId}`,
                          )
                        }
                      >
                        Enter Program Dashboard
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Program Track"
        subtitle="Establish a specialized curriculum under this division."
        icon={<BookOpen />}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Track Name" required>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Full-Stack Web Development"
            />
          </FormField>

          <FormField label="Curriculum Description">
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detail the goals and scope of this track..."
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 shadow-lg shadow-brand-accent/20"
            >
              Establish Track
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
