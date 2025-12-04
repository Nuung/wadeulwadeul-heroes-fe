import MobileBottomNav from "@/shared/ui/BottomNav";
import { ImageSlider } from "../../shared/ui/ImageSlider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CategoryTab } from "./CategoryTab";
import { NavMenu } from "./NavMenu";

const SAMPLE_SLIDES = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    title: "자연 속 힐링",
    description: "아름다운 산과 함께하는 특별한 경험",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
    title: "도심 속 여행",
    description: "도시의 숨은 매력을 발견하세요",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    title: "바다와 함께",
    description: "푸른 바다가 주는 평화로운 시간",
  },
];

export function UserMain() {
  const location = useLocation();
  const [currPath, setCurrPath] = useState(
    location.pathname.substring(1) || "user",
  );
  const navigation = useNavigate();
  const onChange = (value: string) => {
    setCurrPath(value);
    navigation(`/${value}`);
  };

  useEffect(() => {
    const path = location.pathname.substring(1);
    setCurrPath(path || "user");
  }, [location.pathname]);

  return (
    <>
      <NavMenu />
      <div className="w-full mt-3">
        <CategoryTab />
      </div>
      <div className="w-full max-w-6xl mx-auto py-4">
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
              <p className="text-sm uppercase tracking-wide text-white/80">
                상세 정보
              </p>
              <h3 className="text-2xl font-bold">{slide.title}</h3>
              {slide.description && (
                <p className="text-sm text-white/90 leading-relaxed">
                  {slide.description}
                </p>
              )}
            </>
          )}
        />
      </div>
      <MobileBottomNav value={currPath} onChange={onChange} />
    </>
  );
}
