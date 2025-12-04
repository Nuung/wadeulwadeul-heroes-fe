import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box, Text, VStack } from "@vapor-ui/core";

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  discount: string;
}

interface HeroSwiperProps {
  slides: HeroSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export function HeroSwiper({
  slides,
  autoplay = false,
  autoplayDelay = 3000,
}: HeroSwiperProps) {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={
        autoplay
          ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
            }
          : false
      }
      className="w-full rounded-2xl overflow-hidden"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-[400px]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
              <VStack gap="$200" className="text-white">
                <Text typography="heading5" className="text-yellow-400">
                  {slide.discount}
                </Text>
                <Text typography="heading1" className="font-bold">
                  {slide.title}
                </Text>
                <Text typography="heading4" className="font-medium opacity-90">
                  {slide.subtitle}
                </Text>
              </VStack>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
