import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function Slider() {
  const slides = [
    { id: 1, src: "/images/banner-1.png", alt: "Event 1" },
    { id: 2, src: "/images/banner-2.png", alt: "Event 2" },
    {
      id: 3,
      src: "/images/subscription_event.png",
      alt: "Event 3",
      link: "/event/detail/2",
    },
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: true }} // 3초마다 자동 슬라이드 & 사용자가 조작(터치,클릭)한 이후로 자동재생 멈춤
      loop // 무한 루프 설정
      spaceBetween={0}
      slidesPerView={1}
      className="w-[600px] h-[400px] custom-swiper" // Swiper 크기 지정
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className="relative w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
