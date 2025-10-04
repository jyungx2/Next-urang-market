import Modal from "@/components/layout/modal";
import { RingLoader } from "react-spinners";

export default function FileAuthPage() {
  return (
    <Modal>
      <div className="flex flex-col gap-10 items-center justify-center">
        <RingLoader />
        <span>잠시만 기다려주세요...</span>
      </div>
    </Modal>
  );
}
// 나중에 지울 컴포넌트
