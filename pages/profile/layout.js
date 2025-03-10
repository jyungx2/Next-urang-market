export default function ProfileLayout({ children }) {
  return (
    <div className="flex flex-col p-6 bg-[var(--color-bg)]">
      <main className="flex flex-col gap-14">{children}</main>
    </div>
  );
}
