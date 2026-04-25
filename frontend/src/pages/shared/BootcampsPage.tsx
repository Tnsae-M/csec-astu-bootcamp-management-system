import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';

export default function BootcampsPage() {
  const { role, divisionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Bootcamps</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Division ID: {divisionId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mock Bootcamp Card */}
        <Card className="group hover:border-brand-accent/40 transition-all flex flex-col justify-between overflow-hidden bg-brand-primary border-brand-border shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-black text-text-main uppercase tracking-tighter group-hover:text-brand-accent transition-colors">
              Mock Bootcamp 1
            </CardTitle>
            <CardDescription className="text-xs text-text-muted min-h-[40px] pt-2">
              This is a scaffolded placeholder bootcamp.
            </CardDescription>
          </CardHeader>
          
          <CardFooter className="pt-6 border-t border-brand-border flex gap-3 mt-auto bg-transparent px-6 pb-6">
            <button 
              onClick={() => navigate(`/dashboard/${role}/divisions/${divisionId}/bootcamps/mock-bootcamp-id`)}
              className="flex-1 bg-brand-primary border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
            >
              View Bootcamp Dashboard
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
