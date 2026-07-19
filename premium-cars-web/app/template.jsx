// Template App Router: remount di setiap navigasi → animasi masuk halaman.
export default function Template({ children }) {
  return <div className="route-enter">{children}</div>;
}
