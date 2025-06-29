import Layout from "@/components/layout/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import SocketClient from "@/components/market/socket-client";
import useCurrentUserStore from "@/zustand/currentUserStore";

export default function ChatPage() {
  const router = useRouter();
  const { productId } = router.query;
  const { currentUser } = useCurrentUserStore();
  const buyerId = currentUser?.id;
  console.log("CSR productId: ", productId);

  // const [messages, setMessages] = useState([
  //   { id: 1, sender: "me", text: "안녕하세요! 이거 아직 판매 중인가요?" },
  //   { id: 2, sender: "other", text: "네! 아직 판매 중입니다." },
  // ]);

  // const [inputText, setInputText] = useState("");
  // const messagesEndRef = useRef(null);

  // // ✅ WebSocket 연결 (예제)
  // useEffect(() => {
  //   const socket = new WebSocket("wss://your-websocket-url");

  //   socket.onmessage = (event) => {
  //     const newMessage = JSON.parse(event.data);
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // // ✅ 스크롤 자동 이동 (최신 메시지 보이기)
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // // ✅ 메시지 전송
  // const sendMessage = () => {
  //   if (!inputText.trim()) return;

  //   const newMessage = { id: Date.now(), sender: "me", text: inputText };
  //   setMessages((prev) => [...prev, newMessage]);
  //   setInputText("");

  //   // WebSocket으로 서버에 메시지 전송
  //   // socket.send(JSON.stringify(newMessage));
  // };

  // const router = useRouter();
  // const postId = router.query.postId;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-col">
        <div className="flex justify-center items-center relative p-4">
          <button
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 p-4"
            onClick={() => router.push(`/market/${productId}`)}
          >
            <Image
              src="/icons/chevron-left.svg"
              alt="icon"
              width={30}
              height={30}
            />
          </button>
          <div className="flex flex-col justify-center items-center ">
            <span className="font-bold text-2xl">테이스트피트니스팀장</span>
            <span className="text-sm font-medium">
              Typically replies in 10 mins
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-gray-300 p-4 bg-gray-200">
          <div className="flex gap-4 cursor-pointer">
            <div className="relative w-[48px] aspect-square">
              <Image
                src="/images/example.jpg"
                alt="icon"
                fill
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span>Active</span>
              <span>132만원</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex gap-2 items-center h-fit p-2 border rounded-lg">
              <Image
                src="/icons/calendar.svg"
                alt="set-meetup"
                height={24}
                width={24}
              />
              <span>Set meetup</span>
            </button>
            <button className="flex gap-2 items-center h-fit p-2 border rounded-lg">
              <Image
                src="/icons/currency-dollar.svg"
                alt="purchase"
                height={24}
                width={24}
              />
              <span>Pay in advance</span>
            </button>
          </div>
        </div>
      </header>

      {router.isReady && productId && buyerId && (
        <SocketClient roomId={productId + "_" + buyerId} buyerId={buyerId} />
      )}
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ChatPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
