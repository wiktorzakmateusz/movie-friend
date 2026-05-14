// general layout for login and register pages

import AuthNavbar from "@/components/AuthNavbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* navigation bar */}
      <AuthNavbar />
      
      {/* page content */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}