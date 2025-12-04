import { VStack } from '@vapor-ui/core';
import { HeroSwiper, HeroSlide } from '../shared/ui/HeroSwiper';

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
        <HeroSwiper slides={HERO_SLIDES} autoplay autoplayDelay={4000} />
      </VStack>
    </div>
  );
}
