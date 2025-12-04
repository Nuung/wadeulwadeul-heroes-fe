import { ClassResponse, useClassesQuery } from "@/shared/api/queries";
import { Box, Flex, HStack, IconButton, Text, VStack } from "@vapor-ui/core";

export function CreatorClassList() {
  const { data, isLoading, isSuccess, isError, error } = useClassesQuery();
  const classList = data;
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="450px"
      gap="$200"
      padding="$300"
      backgroundColor="gray-100"
      borderRadius="$200"
      overflow="scroll"
    >
      {isLoading && (
        <Box padding="$100" backgroundColor="$primary-100" className="rounded">
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

  return (
    <Box padding="$100" backgroundColor="$primary-100" className="rounded">
      <VStack gap="$075" alignItems="start" width="100%">
        {/* 클래스 제목 및 소개 */}
        <Text render={<div />} typography="heading4">
          {classData.template?.["체험 제목"]}
        </Text>
        <Text render={<div />} color="$neutral-700">
          {classData.template?.["클래스 소개"]}
        </Text>

        {/* 기본 정보 */}
        <VStack gap="$050">
          <Text render={<div />}>카테고리: {classData.category}</Text>
          <Text render={<div />}>위치: {classData.location}</Text>
          <Text render={<div />}>가격: {classData.price_per_person}</Text>
          <Text render={<div />}>인원: {classData.capacity}명</Text>
          <Text render={<div />}>
            소요 시간: {classData.duration_minutes}분
          </Text>
        </VStack>

        {/* 추가 정보 */}
        <VStack gap="$025" alignItems="start">
          <Text render={<div />}>경력: {classData.years_of_experience}</Text>
          <Text render={<div />}>직무: {classData.job_description}</Text>
          <Text render={<div />}>준비물: {classData.materials}</Text>
        </VStack>

        {/* 날짜 표시 (임시) */}
        <Text color="$neutral-500">
          등록 날짜: {dayOfWeek} {dayOfMonth}일
        </Text>
      </VStack>
    </Box>
  );
}
