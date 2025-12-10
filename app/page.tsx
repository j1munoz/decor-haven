import Navbar from "@/components/navbar";
import Landing from "@/components/home/landing";
import WhoWeAre from "@/components/home/whoweare";
import Items from "@/components/item/items";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Navbar />
      <Landing />
      <Items />
      <WhoWeAre />
    </main>
  );
}
