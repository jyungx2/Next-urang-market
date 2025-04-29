export default function LoginPage() {
  return <div>Hi</div>;
}

// ✅ Layout 적용되도록 getLayout 설정
LoginPage.getLayout = function haveLayout(page) {
  return (
    <div className="min-h-screen max-w-[640px] mx-auto bg-[var(--color-com-bg)]">
      {page}
    </div>
  ); // Layout 안 씌움
};
