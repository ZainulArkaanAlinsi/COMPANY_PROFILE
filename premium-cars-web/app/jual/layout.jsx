import SellNav from "@/components/SellNav";

// Semua halaman /jual* berbagi sub-navigasi terminal Sell & Trade.
export default function JualLayout({ children }) {
  return (
    <>
      <SellNav />
      {children}
    </>
  );
}
