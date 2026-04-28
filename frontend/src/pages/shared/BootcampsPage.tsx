import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button, Modal } from '../../components/ui';
import { Plus, Activity, BookOpen } from 'lucide-react';
import { bootcampsService } from '../../services/bootcamps.service';
import { setBootcampsStart, setBootcampsSuccess, setBootcampsFailure } from '../../features/bootcamps/bootcampsSlice';

export default function BootcampsPage() {
  const { role, divisionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { bootcamps, loading } = useSelector((state: RootState) => state.bootcamps);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER ADMIN';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE'
  });

  const fetchBootcamps = () => {
    if (!divisionId) return;
    dispatch(setBootcampsStart());
    bootcampsService.getBootcampsByDivision(divisionId)
      .then(res => dispatch(setBootcampsSuccess(res.data || [])))
      .catch(err => dispatch(setBootcampsFailure(err.message)));
  };

  useEffect(() => {
    fetchBootcamps();
  }, [divisionId, dispatch]);

  const filteredBootcamps = bootcamps.filter(b => 
    b.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisionId) return;
    try {
      await bootcampsService.createBootcamp(divisionId, formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', status: 'ACTIVE' });
      fetchBootcamps();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Bootcamps</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Division Programs & Training Tracks</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-accent text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20"
          >
            <Plus size={16} className="mr-2" />Add Bootcamp
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-text-muted font-bold uppercase py-10">Loading Bootcamps...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBootcamps.map(bootcamp => {
          const bId = bootcamp._id || bootcamp.id;
          return (
            <Card key={bId} className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm">
              <CardHeader className="flex flex-col space-y-1.5 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                      <Activity size={10} /> <span>{bootcamp.status || 'ACTIVE'}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">
                  {bootcamp.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-text-muted mt-1">
                  {bootcamp.description || 'No description available for this bootcamp.'}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="mt-auto pt-4 flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/dashboard/${role}/divisions/${divisionId}/bootcamps/${bId}`)}
                  className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white"
                >
                  View Dashboard
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        {filteredBootcamps.length === 0 && (
          <div className="col-span-full text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
            No bootcamps found.
          </div>
        )}
      </div>
      )}

      {/* CREATE MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Establish New Bootcamp"
        subtitle="Create a new program track under this division."
        icon={<BookOpen />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Bootcamp Name</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="e.g. Full-Stack Web Development" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Program Description</label>
            <textarea 
              rows={4}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors resize-none" 
              placeholder="Describe the curriculum and goals..." 
            />
          </div>
          
          <div className="pt-6 mt-6 border-t border-brand-border flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl border border-brand-border text-text-muted text-[10px] font-black uppercase tracking-widest hover:text-text-main hover:bg-brand-primary/80 transition-colors"
            >
              Cancel
            </button>
            <Button 
              type="submit"
              className="px-6 py-3 shadow-lg shadow-brand-accent/20 flex items-center"
            >
              Establish Track
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
