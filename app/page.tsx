import Navbar from "@/components/navbar";
import Landing from "@/components/home/landing";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Navbar />
      <Landing />
    </main>
  );
}
