import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="frame flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="display text-8xl text-amber md:text-9xl">404</p>
      <h1 className="display mt-4 text-3xl">Unit Tidak Ditemukan</h1>
      <p className="mt-3 max-w-md text-muted">
        Halaman atau kendaraan yang Anda cari mungkin telah terjual atau
        dipindahkan ke garasi lain.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/" variant="solid">Kembali ke Home</Button>
        <Button href="/katalog" variant="ghost">Lihat Katalog</Button>
      </div>
    </div>
  );
}
