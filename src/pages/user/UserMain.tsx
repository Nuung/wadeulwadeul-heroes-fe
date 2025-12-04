import MobileBottomNav from "@/shared/ui/BottomNav";
import { ImageSlider } from "../../shared/ui/ImageSlider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CategoryTab } from "./CategoryTab";
import { NavMenu } from "./NavMenu";
import { usePublicClassesQuery } from "@/shared/api/queries";

export function UserMain() {
  const location = useLocation();
  const [currPath, setCurrPath] = useState(
    location.pathname.substring(1) || "user"
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

  const { data, isLoading, isSuccess } = usePublicClassesQuery();

  const classDescList = ["클래스 소개", "난이도", "로드맵"];
  return (
    <>
      <NavMenu />
      <div className="w-full mt-3">
        <CategoryTab />
      </div>
      {isLoading || !isSuccess ? (
        <>데이터를 조회중입니다...</>
      ) : (
        <div className="w-full max-w-6xl mx-auto py-4">
          <ImageSlider
            slides={data}
            spaceBetween={12}
            slidesPerView={1.2}
            centeredSlides
            navigation={false}
            hoverFlip
            flipMode="tap"
            renderBack={(slide) => (
              <>
                <h4>{slide.template["체험 제목"]}</h4>
                <h5>{slide.capacity} 년차</h5>
                <hr />

                {slide.template && (
                  <>
                    {classDescList.map((desc) => (
                      <>
                        <p className="text-sm text-white/90 leading-relaxed">
                          {desc}
                        </p>
                        <p className="text-xs text-white/90 leading-relaxed">
                          {slide.template[desc]}
                        </p>
                      </>
                    ))}
                  </>
                )}
              </>
            )}
          />
        </div>
      )}
      <MobileBottomNav value={currPath} onChange={onChange} />
    </>
  );
}
