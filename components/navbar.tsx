import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import AuthButton from "@/components/auth-button";
import SearchBar from "@/components/searchbar";

const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center border-b-4 border-decor-olive-600 p-4">
      <Link href="/">
        <Image src={Logo} alt="logo" />
      </Link>
      <SearchBar />
      <AuthButton />
    </div>
  );
};

export default Navbar;
