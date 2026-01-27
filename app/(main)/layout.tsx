import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      {/* Optional: Common Footer for main app area */}
      <footer className="w-full flex justify-between px-8 py-4 text-xs text-gray-400 border-t bg-gray-50">
        <span>info & contact</span>
        <span>report an issue</span>
      </footer>
    </div>
  );
}