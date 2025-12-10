import Link from "next/link";

interface ItemProps {
  id: string;
  name: string;
  price: string;
  url: string | null;
}

const Item = ({ id, url, name, price }: ItemProps) => {
  return (
    <Link
      href={`/item/${id}`}
      className="flex flex-col items-center justify-center text-black shadow-xl hover:scale-105 transition-transform m-8 p-5"
    >
      <img src={url} alt={name} className="w-[20vw] h-[20vw] object-cover" />
      <div className="mt-4 text-4xl">{name}</div>
      <div className="mt-2 text-2xl">
        <strong>${price}</strong> per month
      </div>
    </Link>
  );
};

export default Item;
