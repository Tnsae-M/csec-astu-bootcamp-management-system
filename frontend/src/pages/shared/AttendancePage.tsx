import React, { useEffect } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Users } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { enrollmentsService } from "../../services/enrollments.service";
import {
  fetchSessionAttendance,
  markAttendanceAsync,
  fetchMyAttendance,
} from "../../features/attendance/attendanceSlice";
import { fetchBootcampEnrollments } from "../../features/enrollments/enrollmentsSlice";


interface AttendancePageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function AttendancePage({
  sessionId,
  bootcampId,
}: AttendancePageProps) {
  const dispatch: any = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const user: any = authState.user;
  const enrollmentsState = useSelector((state: RootState) => state.enrollments);
  const enrollments: any[] = enrollmentsState.enrollments;
  const enrollmentsLoading: boolean = enrollmentsState.loading;
  const attendanceState = useSelector((state: RootState) => state.attendance);
  const records: any[] = attendanceState.records;
  const attendanceLoading: boolean = attendanceState.loading;

  const isInstructor = user?.role === "INSTRUCTOR" || user?.role === "ADMIN";

  useEffect(() => {
    if (isInstructor && bootcampId) {
      dispatch(fetchBootcampEnrollments(bootcampId));
    }

    if (sessionId) {
      if (isInstructor) {
        dispatch(fetchSessionAttendance(sessionId));
      } else {
        dispatch(fetchMyAttendance());
      }
    }
  }, [dispatch, sessionId, bootcampId, isInstructor]);


  const handleMarkAttendance = async (userId: string) => {
    if (!sessionId) return;
    try {
      const data = {
        userId,
        sessionId,
        status: "present",
      };
      dispatch(markAttendanceAsync(data));
    } catch (error: any) {
      console.error("Failed to mark attendance", error);
    }
  };

  const getStatus = (studentId: string) => {
    const record = records.find(
      (r: any) => (r.user?._id || r.user) === studentId,
    );
    return record?.status || "PENDING";
  };

  if (enrollmentsLoading || attendanceLoading) {
    return (
      <div className="text-center py-10 font-bold uppercase text-text-muted">
        Loading Attendance Data...
      </div>
    );
  }

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">
          {isInstructor ? "Attendance Governance" : "My Session Presence"}
        </h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">
          Verified Participation Registry
        </p>
      </div>

      <div className="geo-card overflow-hidden">
        {isInstructor ? (
          enrollments.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="mx-auto text-brand-border mb-4" />
              <p className="text-text-muted font-black uppercase tracking-widest text-xs">
                No students registered yet.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-brand-primary/50 border-b border-brand-border">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Student Name
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Email
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Verification Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment: any) => {
                  const studentId = enrollment.user?._id || enrollment.user;
                  const status = getStatus(studentId);
                  return (
                    <tr
                      key={enrollment._id}
                      className="border-b border-brand-border hover:bg-brand-primary/30 transition-colors last:border-0"
                    >
                      <td className="px-8 py-6 font-black text-text-main uppercase tracking-tight text-sm">
                        {enrollment.user?.name || "Unknown Student"}
                      </td>
                      <td className="px-8 py-6 text-xs text-text-muted">
                        {enrollment.user?.email || "N/A"}
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={cn(
                            "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                            status.toLowerCase() === "present"
                              ? "bg-green-100 text-green-700"
                              : status.toLowerCase() === "absent"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {status.toLowerCase() === "present" ? (
                            <CheckCircle2 size={10} />
                          ) : status.toLowerCase() === "absent" ? (
                            <XCircle size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          <span>{status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleMarkAttendance(studentId)}
                          disabled={status.toLowerCase() === "present"}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            status.toLowerCase() === "present"
                              ? "text-text-muted cursor-not-allowed"
                              : "text-brand-accent hover:underline",
                          )}
                        >
                          {status.toLowerCase() === "present"
                            ? "Verified"
                            : "Mark Present"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          <div className="p-10 text-center">
            {records.length === 0 ? (
              <p className="text-text-muted font-black uppercase tracking-widest text-xs">
                No attendance status for this session yet.
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                  Your Status for this Session
                </p>
                <div
                  className={cn(
                    "inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg",
                    records[0]?.status === "PRESENT"
                      ? "bg-green-100 text-green-700 shadow-green-100/50"
                      : records[0]?.status === "ABSENT"
                        ? "bg-red-100 text-red-700 shadow-red-100/50"
                        : "bg-yellow-100 text-yellow-700 shadow-yellow-100/50",
                  )}
                >
                  {records[0]?.status === "PRESENT" ? (
                    <CheckCircle2 size={16} />
                  ) : records[0]?.status === "ABSENT" ? (
                    <XCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  <span>{records[0]?.status}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
