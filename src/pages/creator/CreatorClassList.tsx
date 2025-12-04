import { ClassResponse, useClassesQuery } from "@/shared/api/queries";
import { Box, Flex, HStack, IconButton, Text, VStack } from "@vapor-ui/core";

export function CreatorClassList() {
  const { data, isLoading, isSuccess, isError, error } = useClassesQuery();
  const classList = data;
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="490px"
      gap="$200"
      padding="$300"
      backgroundColor="gray-100"
      borderRadius="$200"
      overflow="scroll"
      className="mt-2"
    >
      {isLoading && (
        <Box
          padding="$100"
          backgroundColor="$primary-100"
          className="rounded"
          width="100%"
        >
          <Text render={<div />}>클래스 목록을 불러오는 중입니다...</Text>
        </Box>
      )}
      {isError && (
        <Text render={<div />}>오류가 발생했습니다: {error.message}</Text>
      )}
      {isSuccess &&
        classList?.map((classData) => (
          <CreatorCard key={classData.id} classData={classData} />
        ))}
    </Flex>
  );
}

export function CreatorCard({ classData }: { classData: ClassResponse }) {
  const date = new Date();
  const dayOfMonth = date.getDate();
  const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "short" });

  const formatPrice = (value?: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return value ?? "-";
    }
    return `${new Intl.NumberFormat("ko-KR").format(parsed)}원`;
  };

  return (
    <Box
      key={classData.id}
      className="rounded-xl border border-surface-200 bg-surface-50 p-4 shadow-sm"
    >
      <HStack className="justify-between items-start gap-3">
        <Text typography="subtitle1" className="font-semibold">
          {classData?.job_description ?? "클래스"}
        </Text>
        <Text typography="body3" className="text-surface-500">
          신청
        </Text>
      </HStack>
      <HStack className="gap-2 flex-wrap mt-2">
        <Text typography="body3" className="text-surface-500">
          카테고리 · {classData?.category ?? "-"}
        </Text>
        <Text typography="body3" className="text-surface-500">
          장소 · {classData?.location ?? "-"}
        </Text>
      </HStack>
      <HStack className="gap-3 mt-2 flex-wrap">
        <Text typography="body3" className="text-surface-500">
          인당 비용 · {formatPrice(classData?.price_per_person)}
        </Text>
        <Text typography="body3" className="text-surface-500">
          소요 시간 · {classData?.duration_minutes ?? "-"}분
        </Text>
        <Text typography="body3" className="text-surface-500">
          신청 인원 · {classData.capacity}명
        </Text>
      </HStack>
    </Box>
  );
}
