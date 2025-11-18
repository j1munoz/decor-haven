import Logo from "@/public/logo.svg";
import Image from "next/image";
import sidebar from "@/data/sidebar";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center text-black bg-decor-olive-600 h-screen w-1/6 gap-6">
      <Image src={Logo} alt="Logo" />
      {sidebar.map(({ title, subLinks }, index) => (
        <div key={index} className="flex flex-col gap-3 w-full items-center">
          <div className="text-xl text-decor-olive-200 items-start w-3/4">
            {title}
          </div>
          <div className="flex flex-col gap-5 items-left text-2xl text-decor-beige-100">
            {subLinks.map(({ name, link }, subIndex) => (
              <Link
                key={subIndex}
                href={link}
                className="hover:text-decor-olive-300 transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div className="border-2 px-8 py-4 rounded-lg border-decor-beige-100">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
