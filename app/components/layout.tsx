export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-gray-50 font-light antialiased">
      {children}
    </div>
  );
}
