// Template App Router: remount di setiap navigasi → animasi masuk halaman
// (reveal konten .route-enter) + sapuan garis cognac di puncak (.route-sweep).
export default function Template({ children }) {
  return (
    <div className="route-enter">
      <span className="route-sweep" aria-hidden="true" />
      {children}
    </div>
  );
}
