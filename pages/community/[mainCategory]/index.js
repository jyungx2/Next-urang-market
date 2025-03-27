import EvenPostList from "@/components/community/even-post-list";
import CommunityLayout from "@/pages/community/layout";
import { useRouter } from "next/router";
import OddPostList from "@/components/community/odd-post-list";

export default function CommunityPage() {
  const router = useRouter();
  const { mainCategory } = router.query;

  if (!mainCategory) return null;

  const DUMMY_DATA_ONE = [
    {
      id: 1,
      writer: "김유랑",
      createdAt: "2025.03.13",
      views: 324,
      title: "유랑마켓 중고거래 이용 가이드 (등업 및 이용)",
    },
    {
      id: 2,
      writer: "김유랑",
      createdAt: "2025.02.28",
      views: 56,
      title: "유랑마켓 포인트 적립 꿀팁!",
    },
    {
      id: 3,
      writer: "김유랑",
      createdAt: "2025.02.11",
      views: 1463,
      title: "영국 워홀 총 정리 (자격조건/신청방법/준비서류/eVisa/Vignette 등)",
    },
  ];

  const DUMMY_DATA_TWO = [
    {
      id: 1,
      writer: "김초밥",
      createdAt: "2025.03.13",
      location: "캐나다 캘거리",
      content: "벤쿠버 부모님 모시고 가기 좋은 한인식당 추천해주세요.",
    },
    {
      id: 2,
      writer: "김어묵",
      location: "캐나다 벤쿠버",
      createdAt: "2025.03.20",
      content:
        "프랑스어 공부하시는 분 계실까요? 프랑스어 유학연수로 프랑스 대신 몬트리올 유학 괜찮나요",
    },
  ];

  if (mainCategory === "notice" || mainCategory === "working-holiday") {
    return (
      <CommunityLayout>
        <OddPostList items={DUMMY_DATA_ONE} />
      </CommunityLayout>
    );
  }

  if (mainCategory === "working-abroad" || mainCategory === "living-abroad") {
    return (
      <CommunityLayout>
        <EvenPostList items={DUMMY_DATA_TWO} />
      </CommunityLayout>
    );
  }
}
