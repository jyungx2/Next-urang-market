// /data/categoryData.js

const categoryData = [
  {
    id: 1,
    name: "공지사항",
    slug: "notice",
    path: "/community",
    subCategories: [
      { id: 101, label: "필독공지", key: "must-notice" },
      { id: 102, label: "업데이트", key: "update" },
    ],
  },
  {
    id: 2,
    name: "해외살이",
    slug: "living-abroad",
    path: "/community/living-abroad",
    subCategories: [
      { id: 201, label: "현지생활", key: "local-life" },
      { id: 202, label: "현지맛집", key: "local-restaurant" },
      { id: 203, label: "친구해요", key: "friends" },
    ],
  },
  {
    id: 3,
    name: "워킹홀리데이",
    slug: "working-holiday",
    path: "/community/working-holiday",
    subCategories: [
      { id: 301, label: "비자승인", key: "visa-accept" },
      { id: 302, label: "경험공유", key: "exp-share" },
    ],
  },
  {
    id: 4,
    name: "해외취업",
    slug: "working-abroad",
    path: "/community/working-abroad",
    subCategories: [
      { id: 401, label: "성공후기", key: "success-review" },
      { id: 402, label: "조언구해요", key: "advise-share" },
    ],
  },
];

export default categoryData;
