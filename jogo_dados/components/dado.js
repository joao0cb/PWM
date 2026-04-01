import Image from "next/image";

// Props: recebe apenas o valor do dado (1-6)
export default function Dado({ valor }) {
  return (
    <div className="dado-wrapper">
      <Image
        src={`/dado${valor}.gif`}
        alt={`Dado mostrando ${valor}`}
        width={90}
        height={90}
        className="dado-img"
        priority
      />
    </div>
  );
}