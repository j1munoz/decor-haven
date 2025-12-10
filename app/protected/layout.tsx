import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex flex-col items-center justify-center w-full">
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          {children}
        </div>
      </div>
    </main>
  );
}
