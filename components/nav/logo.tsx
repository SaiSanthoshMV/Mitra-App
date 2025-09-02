import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.jpeg"
      alt="Mitra Logo"
      width={50}
      height={50}
      style={{ objectFit: "contain" }}
      className="rounded-full"
    />
  );
}