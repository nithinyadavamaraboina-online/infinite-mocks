
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import MockGenerator from './components/MockGenerator';
import LearnGenerator from './components/LearnGenerator';
import LiteMode from './components/LiteMode';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/db';
import { ThemeProvider } from './contexts/ThemeContext';
import { GraduationCap, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<'MOCK' | 'LEARN'>('MOCK');
  const [isLite, setIsLite] = useState(window.location.pathname === '/lite');

  useEffect(() => {
    const handlePopState = () => setIsLite(window.location.pathname === '/lite');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const switchToLite = () => {
    document.cookie = "lite_mode=true; path=/; max-age=31536000"; // 1 year
    window.location.href = "/lite";
  };

  if (isLite) {
    return <LiteMode />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200 flex flex-col transition-colors duration-300">
        <Header user={user} mode={mode} />
        <main className="flex-grow flex flex-col items-center">
          
          {/* --- MOCK / LEARN TOGGLE (Moved from MockGenerator) --- */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full my-6 border border-slate-200 dark:border-slate-700 shadow-inner">
             <button
                onClick={() => setMode('MOCK')}
                className={`
                    w-40 flex items-center justify-center space-x-2 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                    ${mode === 'MOCK' 
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md transform scale-105' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'}
                `}
             >
                <GraduationCap size={16} />
                <span>Mock Test</span>
             </button>
             <button
                onClick={() => setMode('LEARN')}
                className={`
                    w-40 flex items-center justify-center space-x-2 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                    ${mode === 'LEARN' 
                        ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md transform scale-105' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'}
                `}
             >
                <BrainCircuit size={16} />
                <span>Learn</span>
             </button>
          </div>

          {/* Conditional Rendering */}
          {mode === 'MOCK' ? (
             <MockGenerator user={user} />
          ) : (
             <LearnGenerator user={user} />
          )}

        </main>
        <footer className="py-8 text-center text-slate-500 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Infinite Mocks. Built with Gemini 3 Flash.</p>
          <div className="mt-4">
            <button 
              onClick={switchToLite}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
            >
              Switch to Lite Version
            </button>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
