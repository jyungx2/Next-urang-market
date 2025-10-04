export default function ErrorMsg({ target, className = "" }) {
  if (!target) return;
  return (
    <p
      className={`text-[var(--color-error-500)] text-[1.2rem] pl-3 mb-2 ${className}`}
    >
      {target.message}
    </p>
  );
}
