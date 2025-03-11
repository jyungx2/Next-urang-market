export default function AddPost({ onToggle }) {
  return (
    <button
      className="absolute right-5 top-250 bg-[var(--color-secondary-600)] rounded-full px-7 py-5 text-white font-bold cursor-pointer hover:bg-[var(--color-secondary-300)]"
      onClick={onToggle}
    >
      + Post
    </button>
  );
}
