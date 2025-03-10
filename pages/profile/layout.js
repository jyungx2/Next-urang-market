export default function ProfileLayout({ children }) {
  return (
    <div className="flex flex-col p-6 bg-amber-50">
      <aside>SETTING SIDEBAR *temporily*</aside>
      <main className="flex flex-col gap-10">{children}</main>
    </div>
  );
}
