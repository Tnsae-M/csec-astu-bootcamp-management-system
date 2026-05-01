import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Users, 
  Calendar,
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { reportService } from '../../services/all_others.service';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchUsers } from '../../store/userSlice';
import { fetchDivisions } from '../../store/divisionSlice';

const divisionData = [
  { name: 'Software Eng', value: 400 },
  { name: 'Competitive Prog', value: 300 },
  { name: 'Web Dev', value: 300 },
  { name: 'Cybersecurity', value: 200 },
];

const COLORS = ['hsl(225, 73%, 57%)', 'hsl(262, 60%, 58%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)'];

export const ReportsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users = [] } = useSelector((state: RootState) => state.users);
  const { items: divisions = [] } = useSelector((state: RootState) => state.divisions);
  const [reports, setReports] = React.useState<any[]>([]);

  React.useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchDivisions());
    reportService.getReports().then(data => {
      // The controller returns res.json(reports) directly or res.json({ data: reports })?
      // Wait, report.controller.js: res.json(reports); so it's directly an array.
      setReports(Array.isArray(data) ? data : data.data || []);
    }).catch(console.error);
  }, [dispatch]);

  const divisionData = React.useMemo(() => {
    if (!users.length || !divisions.length) return [];
    return divisions.map(div => ({
      name: div.name,
      value: users.filter((u: any) => u.divisionId === div._id).length
    })).filter(d => d.value > 0);
  }, [users, divisions]);

  return (
    <div className="space-y-8">
      <section className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-text-muted">
            Data Analysis
          </p>
          <h1 className="text-3xl font-black tracking-tight uppercase text-text-main">
            System <span className="text-brand-accent">Reports</span>
          </h1>
        </div>
        <Button className="gap-2">
          <Download size={18} />
          Export All Data
        </Button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enrollment by Division</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={divisionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {divisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted px-2">Generated Reports</h3>
            {reports.length === 0 ? (
               <div className="text-center py-12 text-text-muted font-medium text-xs uppercase tracking-widest">No reports found</div>
            ) : reports.map((report: any) => (
                <div key={report._id} className="geo-card p-4 flex items-center justify-between group hover:border-brand-accent cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-text-muted group-hover:text-brand-accent group-hover:bg-brand-accent/5">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight text-text-main">{report.title}</p>
                            <p className="text-[10px] font-medium text-text-muted uppercase">{new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-text-muted group-hover:text-brand-accent" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
