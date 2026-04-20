import React from 'react';
import { motion } from 'motion/react';
import {
  Terminal,
  Shield,
  Database,
  Cpu,
  ChevronRight,
  ArrowUpRight,
  Code,
  Users,
  MessageSquare,
  Facebook,
  Linkedin,
  Send,
  Mail,
  ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui';
import Logo from '../components/common/Logo';

import landingImg from '@/src/assets/images/landing.jpg';

export default function LandingPage() {
  const divisions = [
    {
      title: 'Software Development',
      description: 'Building modern, scalable applications from web to mobile.',
      icon: Code,
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      title: 'Cybersecurity',
      description: 'Securing the digital frontier through ethical hacking and defense.',
      icon: Shield,
      color: 'bg-red-500/10 text-red-400',
    },
    {
      title: 'Data Science',
      description: 'Extracting insights and building intelligent systems with AI.',
      icon: Database,
      color: 'bg-green-500/10 text-green-400',
    },
    {
      title: 'CPD & Soft Skills',
      description: 'Bridging the gap between technical expertise and leadership.',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-primary text-brand-accent selection:bg-brand-accent selection:text-brand-primary overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-brand-border backdrop-blur-md bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo size="sm" showText={true} />
          </div>
          <div className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-text-muted">
            <a href="#divisions" className="hover:text-brand-accent transition-colors">Divisions</a>
            <a href="#about" className="hover:text-brand-accent transition-colors">Framework</a>
            <a href="#contact" className="hover:text-brand-accent transition-colors uppercase">Contact Us</a>
          </div>
          <Link to="/login">
            <Button size="sm" variant="primary" className="px-8 shadow-lg shadow-brand-accent/20">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-6 block border-l-4 border-brand-accent pl-4 py-1">
              Adama Science and Technology University
            </span>
            <h1 className="text-[10vw] md:text-[8vw] lg:text-[7vw] font-black tracking-tighter uppercase leading-[0.85] mb-8 text-text-main ">
              CSEC ASTU<br />
              <span className="text-brand-accent">DIVISION</span> <br />
              BOOTCAMP.
            </h1>
            <p className="text-lg md:text-xl text-text-muted font-medium max-w-2xl leading-relaxed mb-12">
              Empowering technical talent through structured curriculum and industry-standard training.
              Join our advanced academic divisions and bridge the gap to professional excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="px-10 py-5 text-sm shadow-xl shadow-brand-accent/20">
                  Begin Enrollment
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="px-10 py-5 text-sm">
                  Access Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none overflow-hidden">
          <img 
            src={landingImg} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-[0.15] contrast-110 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/40 to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-brand-primary to-transparent" />
        </div>
      </section>

      {/* Stats/Ticker */}
      <div className="border-y border-brand-border bg-white/[0.02] overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-10">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-20 px-10">
              <span className="text-4xl font-black italic uppercase tracking-tighter">4 Divisions</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter opacity-20">•</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter">1200+ Students</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter opacity-20">•</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter text-brand-accent/50">Industry Ready</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter opacity-20">•</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter">Peer Learning</span>
              <span className="text-4xl font-black italic uppercase tracking-tighter opacity-20">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divisions Section */}
      <section id="divisions" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-text-main">Educational Ecosystem</h2>
            <p className="text-text-muted font-bold uppercase tracking-widest text-[11px] border-b-2 border-brand-accent/20 pb-4 w-fit">
              Explore our core technical focus areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {divisions.map((div, i) => (
              <Link key={div.title} to="/register" className="contents">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="geo-card p-10 group hover:border-brand-accent transition-all cursor-pointer relative"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-lg ${div.color}`}>
                    <div.icon size={28} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-text-main group-hover:text-brand-accent transition-colors">{div.title}</h3>
                  <p className="text-text-muted text-sm font-medium leading-relaxed mb-8">
                    {div.description}
                  </p>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-accent">
                    View Track <ArrowUpRight size={14} className="ml-2" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="about" className="py-32 px-6 bg-brand-accent text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-12">
              A Comprehensive <br /> Training <br /> Framework.
            </h2>
            <div className="space-y-10">
              {[
                { title: 'Peer-Directed Pedagogy', text: 'Engage with seniors and industry alumni who provide mentorship based on verified market challenges.' },
                { title: 'Applied Engineering', text: 'Bridge theoretical knowledge with production-ready projects in every single academic division.' },
                { title: 'Unified Learning Portal', text: 'Seamlessly access curriculum, track progress, and communicate through our centralized LMS.' },
              ].map((feat) => (
                <div key={feat.title} className="max-w-md border-l-4 border-white/20 pl-6 group">
                  <h4 className="font-black uppercase tracking-tight text-xl mb-2 group-hover:text-brand-primary transition-colors">{feat.title}</h4>
                  <p className="text-white/70 font-medium text-sm leading-relaxed">{feat.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="geo-card !bg-white p-4 shadow-2xl relative z-10 border-0">
              <div className="aspect-video bg-brand-primary rounded-xl flex items-center justify-center border border-brand-border">
                <div className="text-center">
                  <div className="w-20 h-20 bg-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare size={40} className="text-white" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Scholar Interface Preview</div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-10 bg-white/5 rounded-[60px] blur-3xl -z-10" />
          </div>
        </div>

        <div className="absolute top-20 right-10 text-[20vw] font-black text-white/5 select-none pointer-events-none tracking-tighter uppercase italic">
          LMS
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contact" className="py-24 px-6 border-t border-brand-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div className="space-y-6">
              <Logo size="md" showText={true} />
              <p className="text-text-muted text-sm font-medium leading-relaxed max-w-xs">
                The premier computer science and engineering community at Adama Science and Technology University.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-main">Get in Touch</h4>
              <div className="space-y-4">
                <a href="mailto:csec@astu.edu.et" className="flex items-center gap-3 text-text-muted hover:text-brand-accent transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="font-bold text-sm">csec@astu.edu.et</span>
                </a>
                <a href="https://forms.gle/WzxkpHAF3iKy9eCT9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-muted hover:text-brand-accent transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                    <ClipboardList size={18} />
                  </div>
                  <span className="font-bold text-sm">Submit Feedback</span>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-main">Connect with Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: 'https://ift.tt/2PEWePp', label: 'Facebook' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/company/csec-astu', label: 'LinkedIn' },
                  { icon: Send, href: 'https://t.me/CSEC_ASTU', label: 'Telegram' }
                ].map((social) => (
                  <a 
                    key={social.label}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-text-muted hover:text-brand-accent hover:bg-brand-accent/10 transition-all group"
                    title={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest opacity-60">
              © 2026 CSEC Adama Science & Technology University
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-text-muted">
              <a href="#" className="hover:text-brand-accent">Terms</a>
              <a href="#" className="hover:text-brand-accent">Security</a>
              <a href="#" className="hover:text-brand-accent">Bylaws</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
