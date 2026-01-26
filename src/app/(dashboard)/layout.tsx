import { Sidebar } from '@/components/layout/sidebar';
import { DashboardNavbar } from '@/components/layout/dashboard-navbar';
import { ResourceCacheProvider } from '@/providers/resource-cache-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResourceCacheProvider>
      <div className="h-full relative min-h-screen bg-background overflow-hidden flex">
         {/* Background Blobs (Reused from Home) */}
         <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[20%] w-[25%] h-[25%] bg-accent/20 rounded-full blur-[100px]" />
        </div>

        {/* Sidebar */}
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="md:pl-72 flex-1 flex flex-col relative z-10 min-h-screen">
          <DashboardNavbar />
          <div className="flex-1 p-8 overflow-y-auto">
              {children}
          </div>
        </main>
      </div>
    </ResourceCacheProvider>
  );
}
