import { VStack, Box, Text } from '@vapor-ui/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  discount: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    title: '입맛 돋는 요즘엔',
    subtitle: '베스트 디저트페어',
    discount: '단독 ~47%',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    title: '취향을 함유하는 식탁',
    subtitle: '시즌 맞춤 레시피',
    discount: '특별 할인 중',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    title: '셰프와 함께하는 시간',
    subtitle: '프리미엄 쿠킹 클래스',
    discount: '얼리버드 ~30%',
  },
];

export default function Home() {
  return (
    <div className="v-min-h-screen v-bg-canvas-100 v-p-6">
      <VStack gap="$400" className="v-max-w-7xl v-mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          style={{ width: '100%', borderRadius: '16px' }}
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Box
                borderRadius="$300"
                overflow="hidden"
                style={{
                  position: 'relative',
                  height: '400px',
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  padding="$400"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  }}
                >
                  <VStack gap="$100">
                    <Text typography="heading2" foreground="white">
                      {slide.title}
                    </Text>
                    <Text typography="body1" foreground="white">
                      {slide.subtitle}
                    </Text>
                    <Text typography="body2" foreground="primary-100">
                      {slide.discount}
                    </Text>
                  </VStack>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </VStack>
    </div>
  );
}
