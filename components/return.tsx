import { FaArrowAltCircleLeft } from "react-icons/fa";
import Link from "next/link";

const Return = () => {
  return (
    <div className="absolute left-[10%] top-[10%]">
      <Link
        href="/"
        className="text-6xl text-decor-olive-600 hover:text-decor-olive-500 transition-colors"
      >
        <FaArrowAltCircleLeft />
      </Link>
    </div>
  );
};

export default Return;
