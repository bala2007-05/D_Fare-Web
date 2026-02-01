import TopBar from './TopBar';
import Footer from './Footer';

export default function MainLayout({ children, activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen flex flex-col" style={{
      position: 'relative',
      zIndex: 1
    }}>
      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content area with proper spacing for top bar */}
      <main className="flex-1 pt-[120px] px-6 pb-12">
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
