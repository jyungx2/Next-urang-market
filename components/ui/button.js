import className from "classnames";
import Link from "next/link";
import { GoSync } from "react-icons/go";

export default function Button({
  children,
  link,
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  loading,
  ...rest
}) {
  const classes = className(
    rest.className,
    "flex items-center px-4 py-1.5 rounded-lg h-12",
    {
      "opacity-80": loading,
      "text-[var(--color-primary-500)] bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)]":
        primary && !outline,
      "text-[var(--color-grey-500)] bg-[var(--color-grey-50)] hover:bg-[var(--color-grey-100)]":
        secondary && !outline,
      "border-[var(--color-secondary-500)] bg-[var(--color-secondary-500)]":
        success && !outline,
      "border-[var(--color-warning-500)] bg-[var(--color-warning-500)]":
        warning && !outline,
      "border-[var(--color-error-500)] bg-[var(--color-error-500)]":
        danger && !outline,
      // "rounded-full": rounded,
      "bg-white": outline,
      "text-[var(--color-primary-500)]": outline && primary,
      "text-[var(--color-grey-500)]": outline && secondary,
      "text-[var(--color-secondary-500)]": outline && success,
      "text-[var(--color-warning-500)]": outline && warning,
      "text-[var(--color-error-500)]": outline && danger,
    }
  );

  // Link 컴포넌트 처리
  if (link) {
    return (
      <Link href={link} className={classes}>
        {children}
      </Link>
    );
  }

  // 일반 버튼 처리
  return (
    // 모든 HTML 버튼 요소들은 Disabled라는 Prop을 받는다.
    // 해당 prop value (=loading)가 true일 때마다, 즉 로딩중일 때마다 시용자가 버튼을 클릭하지 못하게 막는다. (click event is blocked.)
    <button {...rest} disabled={loading} className={classes}>
      {loading ? <GoSync className="animate-spin" /> : children}
    </button>
  );
}
