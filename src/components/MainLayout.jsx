import React from 'react';
import Navigation from './Navigation';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Navigation />
      <main className="transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
