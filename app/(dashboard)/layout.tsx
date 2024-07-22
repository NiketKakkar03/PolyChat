import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import MobileSidebar from "@/components/ui/mobile-sidebar";

const DashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full relative flex">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      
      

      <main className="flex-1 md:ml-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
