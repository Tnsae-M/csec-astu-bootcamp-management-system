import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Button,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui';
import { tasksService } from '../../services/tasks.service';
import { submissionsService } from '../../services/submissions.service';

interface SubmissionsPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function SubmissionsPage({
  sessionId,
  bootcampId,
}: SubmissionsPageProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);

  const [gradeData, setGradeData] = useState({
    grade: 0,
    feedback: '',
    status: 'GRADED',
  });

  const isStandalone = !sessionId || !bootcampId;

  // LOAD TASKS (Standalone)
  useEffect(() => {
    if (isStandalone) {
      tasksService.getTasks().then((res) => {
        const allTasks = res.data || [];
        setTasks(allTasks);
        if (allTasks.length > 0) {
          setSelectedTaskId(allTasks[0]._id || allTasks[0].id);
        }
      });
    }
  }, [isStandalone]);

  // LOAD SUBMISSIONS (Standalone)
  useEffect(() => {
    if (isStandalone && selectedTaskId) {
      setLoading(true);
      submissionsService
        .getSubmissionsByTask(selectedTaskId)
        .then((res) => setSubmissions(res.data || []))
        .finally(() => setLoading(false));
    }
  }, [selectedTaskId, isStandalone]);

  // EMBEDDED MODE (Session-based)
  useEffect(() => {
    const fetchData = async () => {
      if (isStandalone) return;

      setLoading(true);
      try {
        const tasksRes = await tasksService.getTasksByBootcamp(
          bootcampId!
        );
        const allTasks = tasksRes.data || [];

        const sessionTasks = allTasks.filter(
          (t: any) =>
            (t.sessionId?._id || t.sessionId) === sessionId
        );

        const submissionsResults = await Promise.all(
          sessionTasks.map((t: any) =>
            submissionsService.getSubmissionsByTask(
              t._id || t.id
            )
          )
        );

        const allSubmissions = submissionsResults.flatMap(
          (res) => res.data || []
        );

        setSubmissions(allSubmissions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, bootcampId, isStandalone]);

  // FILTER
  const filteredSubmissions = submissions.filter((s) => {
    const term = (searchTerm || '').toLowerCase();

    return (
      (typeof s.studentId === 'object' &&
        s.studentId?.name?.toLowerCase().includes(term)) ||
      s.taskId?.title?.toLowerCase().includes(term)
    );
  });

  // OPEN MODAL
  const handleOpenGrade = (sub: any) => {
    setActiveSubmission(sub);
    setGradeData({
      grade: sub.grade || 0,
      feedback: sub.feedback || '',
      status:
        sub.status === 'PENDING' ? 'GRADED' : sub.status,
    });
    setIsGradeModalOpen(true);
  };

  // SUBMIT GRADE
  const submitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    try {
      await submissionsService.gradeSubmission(
        activeSubmission._id || activeSubmission.id,
        gradeData
      );

      setIsGradeModalOpen(false);

      // refresh
      if (isStandalone) {
        const res =
          await submissionsService.getSubmissionsByTask(
            selectedTaskId
          );
        setSubmissions(res.data || []);
      } else {
        setSubmissions((prev) =>
          prev.map((s) =>
            (s._id || s.id) ===
            (activeSubmission._id || activeSubmission.id)
              ? { ...s, ...gradeData }
              : s
          )
        );
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          Submission Review
        </h1>

        {isStandalone && (
          <select
            value={selectedTaskId}
            onChange={(e) =>
              setSelectedTaskId(e.target.value)
            }
            className="border p-2 rounded"
          >
            {tasks.map((t) => (
              <option
                key={t._id || t.id}
                value={t._id || t.id}
              >
                {t.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSubmissions.map((sub) => {
              const student =
                typeof sub.studentId === 'object'
                  ? sub.studentId?.name
                  : 'Unknown';

              return (
                <TableRow key={sub._id || sub.id}>
                  <TableCell>{student}</TableCell>
                  <TableCell>
                    {sub.taskId?.title}
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs',
                        sub.status === 'GRADED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      {sub.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    {sub.grade || '-'}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleOpenGrade(sub)
                      }
                    >
                      Grade
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Grade Submission"
      >
        <form
          onSubmit={submitGrade}
          className="space-y-4"
        >
          <input
            type="number"
            value={gradeData.grade}
            onChange={(e) =>
              setGradeData({
                ...gradeData,
                grade: Number(e.target.value),
              })
            }
            className="w-full border p-2"
          />

          <textarea
            placeholder="Feedback"
            value={gradeData.feedback}
            onChange={(e) =>
              setGradeData({
                ...gradeData,
                feedback: e.target.value,
              })
            }
            className="w-full border p-2"
          />

          <select
            value={gradeData.status}
            onChange={(e) =>
              setGradeData({
                ...gradeData,
                status: e.target.value,
              })
            }
            className="w-full border p-2"
          >
            <option value="GRADED">GRADED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="PENDING">PENDING</option>
          </select>

          <Button type="submit">Submit</Button>
        </form>
      </Modal>
    </div>
  );
}