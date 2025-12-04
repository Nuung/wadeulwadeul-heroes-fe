import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { ReactNode } from "react";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SlideItem {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

interface ImageSliderProps {
  slides: SlideItem[];
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
  renderBack?: (slide: SlideItem) => ReactNode;
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
      pagination={pagination ? { clickable: true } : false}
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
                <div className="absolute inset-0 backface-hidden">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {slide.title}
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-black/75 text-white flex flex-col justify-center gap-3 p-6">
                  {renderBack ? (
                    renderBack(slide)
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold">{slide.title}</h3>
                      {slide.description && (
                        <p className="text-sm text-white/90 leading-relaxed">
                          {slide.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="text-white/90 text-sm">{slide.description}</p>
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
