import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/common/Logo';
import { Link } from 'react-router-dom';
import { Shield, Rocket, Users, Target, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-brand-primary">
      <nav className="h-20 px-8 flex items-center justify-between max-w-7xl mx-auto">
        <Logo />
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-xs font-black uppercase tracking-widest text-text-main hover:text-brand-accent transition-colors">Login</Link>
          <Link to="/register">
            <Button size="sm" className="font-black uppercase tracking-widest">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-widest mb-8">
            <Rocket size={14} />
            Registration is Open for 2026 Bootcamps
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase leading-[0.85] text-text-main">
            Elevate Your <br />
            <span className="text-brand-accent">Software</span> Journey.
          </h1>
          <p className="mt-8 text-lg text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            CSEC-ASTU Bootcamp Management System is the official platform for the Center of Software Engineering Excellence. Track your sessions, master tasks, and excel in your professional growth.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-16 px-10 text-base font-black uppercase tracking-widest group shadow-2xl shadow-brand-accent/20">
                Join a Bootcamp
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10 text-base font-black uppercase tracking-widest">
              View Divisions
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-brand-card border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12">
            {[
              { icon: Target, title: "Intensive Sessions", desc: "Hand-on sessions led by industry-level instructors and senior students." },
              { icon: Users, title: "Collaborative Groups", desc: "Work in agile groups mentored by experienced software engineers." },
              { icon: Shield, title: "Career Focused", desc: "Curriculum designed to bridge the gap between ASTU and industry standards." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-accent border border-brand-border">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase mb-2 tracking-tight text-text-main">{feature.title}</h3>
                <p className="text-text-muted font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-brand-border bg-brand-primary px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo />
          <div className="flex items-center gap-12">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-brand-accent">Terms</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-brand-accent">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-brand-accent">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
