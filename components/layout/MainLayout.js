import TopBar from './TopBar';
import Footer from './Footer';
export default function MainLayout({ children, activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen flex flex-col" style={{
      position: 'relative',
      zIndex: 1
    }}>
      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main content area - secondary background */}
      <main className="flex-1 pt-[120px] px-6 pb-12 min-h-screen" style={{ background: '#ffffff' }}>
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}