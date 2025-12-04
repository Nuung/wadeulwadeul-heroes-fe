import { ImageSlider } from "../../shared/ui/ImageSlider";

const SAMPLE_SLIDES = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    title: "자연 속 힐링",
    description: "아름다운 산과 함께하는 특별한 경험",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
    title: "도심 속 여행",
    description: "도시의 숨은 매력을 발견하세요",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    title: "바다와 함께",
    description: "푸른 바다가 주는 평화로운 시간",
  },
] as const;

export function UserMain() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">사용자 메인</h1>
      <ImageSlider
        slides={SAMPLE_SLIDES}
        spaceBetween={12}
        slidesPerView={1.2}
        centeredSlides
        navigation={false}
        hoverFlip
        flipMode="tap"
        renderBack={(slide) => (
          <>
            <p className="text-sm uppercase tracking-wide text-white/80">상세 정보</p>
            <h3 className="text-2xl font-bold">{slide.title}</h3>
            {slide.description && (
              <p className="text-sm text-white/90 leading-relaxed">{slide.description}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
