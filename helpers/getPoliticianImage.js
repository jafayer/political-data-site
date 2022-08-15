import Image from "next/image";

export default function PoliticianImage({ politician, dimensions }) {
  return (
    <Image
      src={`https://theunitedstates.io/images/congress/original/${politician.id.bioguide}.jpg`}
      alt={politician.name.official_full}
      objectFit="cover"
      width={dimensions.w}
      height={dimensions.h}
      placeholder="blur"
      blurDataURL="https://theunitedstates.io/images/congress/original/S000033.jpg"
    />
  );
}
