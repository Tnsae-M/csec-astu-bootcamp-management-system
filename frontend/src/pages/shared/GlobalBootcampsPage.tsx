import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui';
import { BookOpen, Activity, Clock, CheckCircle2, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { fetchMyEnrollments, createEnrollmentAsync } from '../../features/enrollments/enrollmentsSlice';
import { fetchBootcamps } from '../../features/bootcamps/bootcampsSlice';

export default function GlobalBootcampsPage() {
  const dispatch = useDispatch() as any;

  const { bootcamps, loading: bcLoading } = useSelector((state: RootState) => state.bootcamps);
  const { myEnrollments, myLoading } = useSelector((state: RootState) => state.enrollments);
  const { user } = useSelector((state: RootState) => state.auth);

  const isStudent = (user?.roles || []).some(r => r.toUpperCase() === 'STUDENT');

  useEffect(() => {
    dispatch(fetchBootcamps());
    if (isStudent) {
      dispatch(fetchMyEnrollments());
    }
  }, [dispatch, isStudent]);

  const safeBootcamps = Array.isArray(bootcamps) ? bootcamps : [];
  const safeEnrollments = Array.isArray(myEnrollments) ? myEnrollments : [];

  // Build a map: bootcampId → enrollment status
  const enrollmentMap: Record<string, string> = {};
  safeEnrollments.forEach(e => {
    const bcId = typeof e.bootcamp === 'object' ? e.bootcamp?._id : (e.bootcamp || e.bootcampId);
    if (bcId) enrollmentMap[bcId] = e.status;
  });

  const handleEnroll = async (bootcampId: string) => {
    const existing = enrollmentMap[bootcampId];
    if (existing) {
      toast.info(`You are already ${existing.toLowerCase()} in this bootcamp`);
      return;
    }
    const result = await dispatch(createEnrollmentAsync({ bootcampId }));
    if (createEnrollmentAsync.fulfilled.match(result)) {
      toast.success('Enrollment request submitted!');
      dispatch(fetchMyEnrollments()); // refresh enrollment status
    } else {
      toast.error(result.payload as string || 'Enrollment failed');
    }
  };

  const getEnrollBtnLabel = (bootcampId: string) => {
    const status = enrollmentMap[bootcampId];
    if (!status) return 'Enroll';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const isEnrolled = (bootcampId: string) => !!enrollmentMap[bootcampId];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  const loading = bcLoading || myLoading;

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white p-6 md:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center pr-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-accent uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-indigo-500">
            Bootcamp Discovery
          </h1>
          <p className="text-text-muted font-bold text-xs md:text-sm uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
            <span className="w-8 h-px bg-brand-accent" />
            Explore and Enroll in Training Tracks
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
          <div className="text-brand-accent font-black uppercase tracking-widest text-sm">Loading Catalogs...</div>
        </div>
      ) : safeBootcamps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-20 h-20 bg-brand-accent/5 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-brand-accent/40" />
          </div>
          <div className="text-text-muted font-black uppercase tracking-widest text-sm">No bootcamps available yet.</div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {safeBootcamps.map((bootcamp: any) => {
            const bcId = bootcamp._id || bootcamp.id;
            const enrolled = isEnrolled(bcId);
            const divisionName = typeof bootcamp.divisionId === 'object'
              ? bootcamp.divisionId?.name
              : bootcamp.division || 'General';

            return (
              <motion.div key={bcId} variants={itemVariants} className="h-full">
                <Card className="flex flex-col h-full hover:border-brand-accent/50 transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-brand-accent/10 group relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="flex flex-col space-y-1.5 pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-white transition-all duration-500 shadow-sm">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center space-x-1 bg-blue-50/80 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                          <Calendar size={10} />
                          <span>{bootcamp.startDate ? new Date(bootcamp.startDate).toLocaleDateString() : 'TBD'}</span>
                        </div>
                        <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          bootcamp.status === 'active' || bootcamp.status === 'ACTIVE'
                            ? 'bg-green-50/80 text-green-700 border-green-100'
                            : bootcamp.status === 'upcoming' || bootcamp.status === 'UPCOMING'
                            ? 'bg-amber-50/80 text-amber-700 border-amber-100'
                            : 'bg-gray-50 text-gray-500 border-gray-100'
                        }`}>
                          <Activity size={10} />
                          <span>{bootcamp.status || 'ACTIVE'}</span>
                        </div>
                      </div>
                    </div>

                    <CardTitle className="text-xl md:text-2xl font-black text-text-main group-hover:text-brand-accent transition-colors duration-300">
                      {bootcamp.name || bootcamp.title}
                    </CardTitle>
                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{divisionName}</p>
                    <CardDescription className="line-clamp-2 text-sm text-text-muted mt-2 leading-relaxed font-medium">
                      {bootcamp.description || 'No description provided.'}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="mt-auto pt-6 relative z-10">
                    {isStudent ? (
                      <Button
                        onClick={() => handleEnroll(bcId)}
                        disabled={enrolled}
                        className={`w-full text-xs font-black uppercase tracking-widest h-11 transition-all duration-300 ${
                          enrolled
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/30 hover:-translate-y-0.5'
                        }`}
                      >
                        {enrolled ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} /> {getEnrollBtnLabel(bcId)}
                          </span>
                        ) : 'Enroll Now'}
                      </Button>
                    ) : (
                      <div className="w-full text-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {safeEnrollments.length > 0 ? `${safeEnrollments.length} enrolled` : 'Enrollment managed by admin'}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
