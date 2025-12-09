import Image from "next/image";
import whoweare from "@/public/whoweare.svg";

const WhoWeAre = () => {
  return (
    <div className="flex flex-col bg-decor-olive-600 items-center justify-center gap-5 text-white p-4">
      <div className="text-7xl">Who We Are</div>
      <div className="flex gap-8 items-center justify-center w-5/6">
        <div className="w-5/6 text-3xl leading-10">
          At Decor Haven, we are passionate about transforming events into
          unforgettable experiences. Our mission is to provide high-quality,
          stylish decor rentals that allow our clients to create magical moments
          without the hassle of purchasing and storing items. We believe that
          every event, big or small, deserves to be beautifully decorated, and
          we are here to make that happen with ease and elegance.
        </div>
        <div className="w-1/2">
          <Image src={whoweare} alt="Who We Are Image" />
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
