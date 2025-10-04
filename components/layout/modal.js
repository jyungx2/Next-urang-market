export default function Modal({ children, onClose }) {
  // 바깥쪽 배경 클릭 시 닫기
  const handleBackgroundClick = (e) => {
    // 만약 이 조건 없이 단순히 onClick={onClose}만 걸면, 모달 안쪽 버튼이나 텍스트를 클릭해도 클릭 이벤트가 버블링되어 부모(배경 div)까지 전달됨.
    // 결과적으로 모달 안쪽을 눌러도 모달이 닫혀버리는 문제 발생.

    // 1. target === currentTarget 조건 → 배경 클릭 여부를 엄격히 체크하는 방식
    // 2. stopPropagation() → 아예 이벤트 버블링을 차단해서 부모에 이벤트가 전달되지 않도록 막는 방식
    if (onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center px-[4rem]"
      onClick={handleBackgroundClick}
    >
      <div
        className={`flex flex-col gap-[1.8rem] bg-white rounded-xl min-w-[24rem] lg:min-w-[28rem] shadow-lg p-[2rem] pt-[3rem] max-w-[34rem]`}
        onClick={(e) => e.stopPropagation()} // 2. 클릭 이벤트 전파 방지(버블링: 자식 -> 부모)하여 모달 안쪽 클릭 시 모달이 닫히지 않도록 함
      >
        {children}
      </div>
    </div>
  );
}
