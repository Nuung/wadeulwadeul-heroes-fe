import { useClassesQuery } from "@/shared/api/queries";
import { Box, Flex, HStack, IconButton, Text, VStack } from "@vapor-ui/core";
import { HeartIcon } from "@vapor-ui/icons";

export function CreatorClassList() {
  const { data, isLoading, isSuccess, isError, error } = useClassesQuery();
  const classList = data;
  return (
    <Flex
      flexDirection="column"
      width="100%"
      gap="$200"
      padding="$300"
      backgroundColor="gray-100"
      borderRadius="$200"
    >
      {isLoading && <Text>클래스 목록을 불러오는 중입니다...</Text>}
      {isError && <Text>오류가 발생했습니다: {error.message}</Text>}
      {isSuccess &&
        classList?.map((classData) => (
          <CreatorCard key={classData.id} classData={classData} />
        ))}
    </Flex>
  );
}

export function CreatorCard({ classData }: { classData: any }) {
  const date = classData.date;

  return (
    <Box padding="$100" backgroundColor="$primary-100" className="rounded">
      <HStack alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          backgroundColor="$secondary-100"
          padding="$200"
          borderRadius="$100"
          margin="$100"
        >
          <VStack alignItems="center">
            <Text render={<div />}>수</Text>
            <Text render={<div />}>22</Text>
          </VStack>
        </Box>
        <VStack gap="$075" justifyContent="start" width="100%">
          <Text>Hello World</Text>
          <Text>Hello World</Text>
        </VStack>
        <IconButton shape="circle" aria-label="원형 좋아요 버튼">
          <HeartIcon />
        </IconButton>
        <IconButton shape="circle" aria-label="원형 좋아요 버튼">
          <HeartIcon />
        </IconButton>
      </HStack>
    </Box>
  );
}
