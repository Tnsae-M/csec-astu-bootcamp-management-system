import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui';
import { BookOpen, Activity, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Bootcamp {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: string;
}

type EnrollmentStatus = 'idle' | 'pending' | 'enrolled';

export default function GlobalBootcampsPage() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, EnrollmentStatus>>({});

  // Simulate fetching bootcamps from backend
  useEffect(() => {
    const fetchBootcamps = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        setBootcamps([
          {
            id: '1',
            title: 'Full-Stack Web Engineering',
            description: 'Master React, Node.js, and modern web development practices in this comprehensive 12-week bootcamp.',
            duration: '12 Weeks',
            status: 'ACTIVE'
          },
          {
            id: '2',
            title: 'Data Science & Machine Learning',
            description: 'Dive deep into Python, Pandas, and Scikit-Learn to build predictive models and analyze complex datasets.',
            duration: '16 Weeks',
            status: 'ACTIVE'
          },
          {
            id: '3',
            title: 'Cloud DevOps & Architecture',
            description: 'Learn AWS, Docker, Kubernetes, and CI/CD pipelines to deploy scalable and secure applications.',
            duration: '10 Weeks',
            status: 'ACTIVE'
          },
          {
            id: '4',
            title: 'Cybersecurity Fundamentals',
            description: 'Understand the core concepts of network security, ethical hacking, and threat mitigation.',
            duration: '8 Weeks',
            status: 'ACTIVE'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchBootcamps();
  }, []);

  const handleEnroll = (bootcampId: string) => {
    const status = enrollmentStatus[bootcampId] || 'idle';

    if (status !== 'idle') {
      toast.error('You have already requested this bootcamp', {
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }

    setEnrollmentStatus(prev => ({
      ...prev,
      [bootcampId]: 'pending'
    }));

    // Simulate API call for enrollment
    setTimeout(() => {
      setEnrollmentStatus(prev => ({
        ...prev,
        [bootcampId]: 'enrolled'
      }));
      toast.success('Successfully requested enrollment!');
    }, 1500);
  };

  const getButtonContent = (bootcampId: string) => {
    const status = enrollmentStatus[bootcampId] || 'idle';
    if (status === 'pending') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </motion.div>
      );
    }
    
    if (status === 'enrolled') {
      return (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center justify-center">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Enrolled
        </motion.div>
      );
    }

    return 'Enroll';
  };

  const getButtonVariant = (bootcampId: string) => {
    const status = enrollmentStatus[bootcampId] || 'idle';
    if (status === 'enrolled') {
      return "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 ring-2 ring-green-600/50 ring-offset-2";
    }
    if (status === 'pending') {
      return "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/30";
    }
    return "bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/30 hover:-translate-y-0.5 active:translate-y-0";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

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
            <span className="w-8 h-px bg-brand-accent"></span>
            Explore and Enroll in Training Tracks
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
          <div className="text-brand-accent font-black uppercase tracking-widest text-sm">Loading Catalogs...</div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {bootcamps.map(bootcamp => (
            <motion.div key={bootcamp.id} variants={itemVariants} className="h-full">
              <Card className="flex flex-col h-full hover:border-brand-accent/50 transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-brand-accent/10 group relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20">
                {/* Decorative background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="flex flex-col space-y-1.5 pb-4 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-white transition-all duration-500 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex space-x-2">
                       <div className="flex items-center space-x-1 bg-blue-50/80 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                        <Clock size={12} /> <span>{bootcamp.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-green-50/80 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                        <Activity size={12} /> <span>{bootcamp.status}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-black text-text-main group-hover:text-brand-accent transition-colors duration-300">
                    {bootcamp.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm text-text-muted mt-2 leading-relaxed font-medium">
                    {bootcamp.description}
                  </CardDescription>
                </CardHeader>
                
                <CardFooter className="mt-auto pt-6 relative z-10">
                  <Button 
                    onClick={() => handleEnroll(bootcamp.id)}
                    disabled={(enrollmentStatus[bootcamp.id] || 'idle') !== 'idle'}
                    className={`w-full text-xs font-black uppercase tracking-widest h-11 transition-all duration-300 ${getButtonVariant(bootcamp.id)}`}
                  >
                    {getButtonContent(bootcamp.id)}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {bootcamps.length === 0 && (
            <motion.div variants={itemVariants} className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-brand-accent/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-brand-accent/40" />
              </div>
              <div className="text-text-muted font-black uppercase tracking-widest text-sm">
                No active bootcamps found.
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
