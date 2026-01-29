import TopBar from './TopBar';

export default function MainLayout({ children, activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content area with proper spacing for top bar (16px + 14px = 30px / 120px total) */}
      <main className="pt-[120px] px-6 pb-6">
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
