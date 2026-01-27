import AuthNavbar from "@/components/AuthNavbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* This adds the Logo bar to all auth pages */}
      <AuthNavbar />
      
      {/* This is where the Login or Register page content is rendered */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}