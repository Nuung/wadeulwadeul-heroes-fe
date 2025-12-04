import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { ReactNode } from "react";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button, Text, VStack } from "@vapor-ui/core";
import { ClassResponse } from "../api/queries";

// 구분자별 이미지 매핑
export const imageMap: Record<string, string> = {
  돌담: "/images/stone.png",
  감귤: "/images/tangerine.jpg",
  해녀: "/images/haenyeo.jpg",
  요리: "/images/cooking.jpg",
  목공: "/images/woodworking.png",
};

interface ImageSliderProps {
  slides: readonly ClassResponse[];
  spaceBetween?: number;
  slidesPerView?: number;
  navigation?: boolean;
  pagination?: boolean;
  centeredSlides?: boolean;
  loop?: boolean;
  /** Enable hover flip to reveal overlay text on top of the image */
  hoverFlip?: boolean;
  /** Flip interaction: hover (desktop) or tap (mobile) */
  flipMode?: "hover" | "tap";
  /** Custom back-face renderer (default shows title/description) */
  renderBack?: (slide: ClassResponse) => ReactNode;
}

export function ImageSlider({
  slides,
  spaceBetween = 30,
  slidesPerView = 1,
  navigation = true,
  pagination = true,
  centeredSlides = false,
  loop = false,
  hoverFlip = false,
  flipMode = "hover",
  renderBack,
}: ImageSliderProps) {
  const [activeFlipId, setActiveFlipId] = useState<string | null>(null);

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      navigation={navigation}
      centeredSlides={centeredSlides}
      loop={loop}
      className="w-full h-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            className={`group relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg ${
              hoverFlip ? "cursor-pointer perspective-[1200px]" : ""
            }`}
            onClick={() => {
              if (!hoverFlip || flipMode !== "tap") return;
              setActiveFlipId((prev) => (prev === slide.id ? null : slide.id));
            }}
            role={hoverFlip && flipMode === "tap" ? "button" : undefined}
            tabIndex={hoverFlip && flipMode === "tap" ? 0 : undefined}
          >
            {hoverFlip ? (
              <div
                className={[
                  "[transform-style:preserve-3d] h-full w-full transition-transform duration-500",
                  flipMode === "hover"
                    ? "group-hover:[transform:rotateY(180deg)]"
                    : activeFlipId === slide.id
                    ? "[transform:rotateY(180deg)]"
                    : "",
                ].join(" ")}
              >
                {/* 앞 */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-5">
                      <img
                        src={imageMap[slide.category]}
                        alt={slide.job_description}
                        className="w-[260px] h-[250px] object-cover"
                      />
                      <VStack>
                        <Text typography="heading6">{slide.category}</Text>
                        <Text typography="subtitle2">
                          {slide.job_description}
                        </Text>
                      </VStack>
                    </div>
                    <Button onClick={(e) => e.stopPropagation()}>
                      전화하기
                    </Button>
                  </div>
                </div>

                {/* 뒤 */}
                <div
                  className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imageMap[slide.category]})`,
                  }}
                >
                  {/* 배경 이미지 위에 텍스트가 잘 보이도록 어두운 오버레이를 추가합니다. */}
                  <div className="absolute inset-0 bg-black/80" />
                  {/* 콘텐츠 */}
                  <div className="relative h-full text-white flex flex-col justify-center gap-3 p-6">
                    {renderBack ? (
                      renderBack(slide)
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold">{slide.category}</h3>
                        {slide.job_description && (
                          <>
                            <p className="text-sm text-white/90 leading-relaxed">
                              {slide.job_description}
                            </p>
                            <p className="text-sm text-white/90 leading-relaxed">
                              {slide.job_description}
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={imageMap[slide.category]}
                  alt={slide.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {slide.category}
                  </h3>
                  {slide.job_description && (
                    <p className="text-white/90 text-sm">
                      {slide.job_description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
