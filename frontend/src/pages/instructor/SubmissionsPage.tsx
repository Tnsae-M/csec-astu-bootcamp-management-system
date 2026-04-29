import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { cn } from '@/lib/utils';
import { 
  fetchTasksByBootcamp, 
  fetchSubmissionsByTask, 
  gradeSubmission 
} from '../../features/tasks/taskSlice';
import { 
  Button, 
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui';
import { toast } from 'sonner';

interface SubmissionsPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function SubmissionsPage({
  sessionId,
  bootcampId,
}: SubmissionsPageProps) {
  const dispatch = useDispatch() as any;
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { tasks, selectedSubmissions: submissions, loading } = useSelector((state: RootState) => state.tasks);

  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);

  const [gradeData, setGradeData] = useState({
    grade: 0,
    feedback: '',
    status: 'GRADED',
  });

  const isStandalone = !sessionId || !bootcampId;

  // LOAD TASKS
  useEffect(() => {
    if (bootcampId) {
      dispatch(fetchTasksByBootcamp(bootcampId));
    }
  }, [bootcampId, dispatch]);

  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
        setSelectedTaskId(tasks[0]._id || tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  // LOAD SUBMISSIONS
  useEffect(() => {
    if (selectedTaskId) {
      dispatch(fetchSubmissionsByTask(selectedTaskId));
    }
  }, [selectedTaskId, dispatch]);

  // FILTER
  const filteredSubmissions = (submissions || []).filter((s) => {
    const term = (searchTerm || '').toLowerCase();
    const studentName = typeof s.studentId === 'object' ? (s.studentId?.name || '') : '';
    const taskTitle = s.taskId?.title || '';

    return (
      studentName.toLowerCase().includes(term) ||
      taskTitle.toLowerCase().includes(term)
    );
  });

  // OPEN MODAL
  const handleOpenGrade = (sub: any) => {
    setActiveSubmission(sub);
    setGradeData({
      grade: sub.grade || 0,
      feedback: sub.feedback || '',
      status: sub.status === 'PENDING' ? 'GRADED' : sub.status,
    });
    setIsGradeModalOpen(true);
  };

  // SUBMIT GRADE
  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    try {
      const result = await dispatch(gradeSubmission({
        id: activeSubmission._id || activeSubmission.id,
        data: gradeData
      }));
      
      if (gradeSubmission.fulfilled.match(result)) {
          toast.success('Grade finalized successfully');
          setIsGradeModalOpen(false);
      } else {
          toast.error((result.payload as string) || 'Grading failed');
      }
    } catch (err: any) {
      toast.error(err.message);
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
          onSubmit={handleSubmitGrade}
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
