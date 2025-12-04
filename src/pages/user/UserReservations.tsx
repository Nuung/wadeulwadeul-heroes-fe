import MobileBottomNav from "@/shared/ui/BottomNav";
import {
  classKeys,
  useMyEnrollmentsQuery,
} from "@/shared/api/queries/class.hooks";
import { getClassById } from "@/shared/api/queries/class.api";
import type { ClassResponse } from "@/shared/api/queries/class.types";
import { useCurrentUserQuery } from "@/shared/api/queries/user.hooks";
import { Box, HStack, Text, VStack } from "@vapor-ui/core";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavMenu } from "./NavMenu";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatPrice = (value?: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return value ?? "-";
  }
  return `${new Intl.NumberFormat("ko-KR").format(parsed)}원`;
};

export function UserReservations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currPath, setCurrPath] = useState(
    location.pathname.substring(1) || "user"
  );

  useEffect(() => {
    const path = location.pathname.substring(1);
    setCurrPath(path || "user");
  }, [location.pathname]);

  const onChange = (value: string) => {
    setCurrPath(value);
    navigate(`/${value}`);
  };

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUserQuery();

  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    error: enrollmentsError,
  } = useMyEnrollmentsQuery({
    enabled: currentUser?.type === "young",
  });

  const classDetails = useQueries({
    queries:
      enrollments?.map((enrollment) => ({
        queryKey: classKeys.detail(enrollment.class_id),
        queryFn: () => getClassById(enrollment.class_id),
        enabled: currentUser?.type === "young" && Boolean(enrollment.class_id),
        staleTime: 5 * 60 * 1000,
      })) ?? [],
  });

  const classInfoById = useMemo(() => {
    const map = new Map<string, ClassResponse>();
    classDetails.forEach((query, index) => {
      const classId = enrollments?.[index]?.class_id;
      if (classId && query.data) {
        map.set(classId, query.data);
      }
    });
    return map;
  }, [classDetails, enrollments]);

  const isClassLoading = classDetails.some((query) => query.isLoading);
  const classError = classDetails.find((query) => query.error)?.error;

  const showLoading = isUserLoading || isEnrollmentsLoading || isClassLoading;
  const combinedError = userError || enrollmentsError || classError;

  return (
    <>
      <NavMenu isSplash />
      <VStack className="w-full gap-4 px-4 pb-[120px]">
        <VStack className="gap-1 mt-2">
          <Text typography="heading3" className="font-semibold">
            예약 현황
          </Text>
          <Text typography="body2" className="text-surface-500">
            청년 사용자가 신청한 클래스 리스트를 확인할 수 있어요.
          </Text>
        </VStack>

        {showLoading && (
          <Box className="rounded-xl border border-surface-200 bg-surface-50 p-4">
            <Text typography="body2" className="text-surface-500">
              데이터를 불러오는 중이에요...
            </Text>
          </Box>
        )}

        {combinedError && (
          <Box className="rounded-xl border border-danger-200 bg-danger-50 p-4">
            <Text typography="body2" className="text-danger-700">
              예약 현황을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </Text>
          </Box>
        )}

        {!showLoading && !combinedError && currentUser?.type !== "young" && (
          <Box className="rounded-xl border border-surface-200 bg-surface-50 p-4">
            <Text typography="body2" className="font-semibold">
              예약 현황은 청년 사용자에게만 제공돼요.
            </Text>
            <Text typography="body3" className="text-surface-500 mt-1">
              계정 정보를 확인하거나 다른 계정으로 로그인해주세요.
            </Text>
          </Box>
        )}

        {!showLoading &&
          !combinedError &&
          currentUser?.type === "young" &&
          (enrollments?.length ?? 0) === 0 && (
            <Box className="rounded-xl border border-surface-200 bg-surface-50 p-4">
              <Text typography="body2" className="font-semibold">
                아직 예약한 클래스가 없어요.
              </Text>
              <Text typography="body3" className="text-surface-500 mt-1">
                관심 있는 클래스를 찾아 신청해보세요.
              </Text>
            </Box>
          )}

        {!showLoading &&
          !combinedError &&
          currentUser?.type === "young" &&
          (enrollments?.length ?? 0) > 0 && (
            <VStack className="gap-3">
              {enrollments?.map((enrollment) => {
                const classInfo = classInfoById.get(enrollment.class_id);
                return (
                  <Box
                    key={enrollment.id}
                    className="rounded-xl border border-surface-200 bg-surface-50 p-4 shadow-sm"
                  >
                    <HStack className="justify-between items-start gap-3">
                      <Text typography="subtitle1" className="font-semibold">
                        {classInfo?.job_description ?? "클래스"}
                      </Text>
                      <Text typography="body3" className="text-surface-500">
                        신청 {formatDate(enrollment.applied_date)}
                      </Text>
                    </HStack>
                    <HStack className="gap-2 flex-wrap mt-2">
                      <Text typography="body3" className="text-surface-500">
                        카테고리 · {classInfo?.category ?? "-"}
                      </Text>
                      <Text typography="body3" className="text-surface-500">
                        장소 · {classInfo?.location ?? "-"}
                      </Text>
                    </HStack>
                    <HStack className="gap-3 mt-2 flex-wrap">
                      <Text typography="body3" className="text-surface-500">
                        인당 비용 · {formatPrice(classInfo?.price_per_person)}
                      </Text>
                      <Text typography="body3" className="text-surface-500">
                        소요 시간 · {classInfo?.duration_minutes ?? "-"}분
                      </Text>
                      <Text typography="body3" className="text-surface-500">
                        신청 인원 · {enrollment.headcount}명
                      </Text>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
      </VStack>
      <MobileBottomNav value={currPath} onChange={onChange} />
    </>
  );
}
