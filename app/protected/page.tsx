import { redirect } from "next/navigation";
import { getUser, getClaims } from "@/utils/userQuery";
import WhoWeAre from "@/components/home/whoweare";
import Landing from "@/components/home/landing";
import Items from "@/components/item/items";

export default async function ProtectedPage() {
  const data = await getClaims();
  if (!data) {
    redirect("/auth/sign-in");
  }

  const user = await getUser(data.sub);
  const isAdmin = user?.role === 2;

  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <Landing />
        <Items />
        <WhoWeAre />
      </div>
    </>
  );
}
