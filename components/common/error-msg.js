export default function ErrorMsg({ target }) {
  if (!target) return;
  return (
    <p className="text-[var(--color-error-500)] text-[14px] pl-3 mb-4">
      {target.message}
    </p>
  );
}
