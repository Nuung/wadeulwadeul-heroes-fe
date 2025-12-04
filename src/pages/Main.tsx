import { Button, HStack, VStack, Text } from "@vapor-ui/core";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  return (
    <VStack
      className="
        w-full 
        h-[100dvh]
        overflow-hidden
        justify-center 
        items-center 
        gap-10
      "
    >
      <VStack className="items-center gap-2">
        <Text className="text-3xl font-bold">삼춘한수</Text>
        <Text className="text-surface-500 text-sm">한 수 배워가는 공간</Text>
      </VStack>

      <VStack className="w-full px-6 gap-6">
        <Button
          className="
            w-full 
            py-6
            text-xl
            text-white
          "
          color="$primary-200"
          onClick={() => navigate("/creator")}
        >
          클래스를 만들래요
        </Button>

        <Button
          className="
            w-full 
            py-6
            text-xl
            text-white
          "
          color="$primary-200"
          onClick={() => navigate("/user")}
        >
          클래스에 참여할래요
        </Button>
      </VStack>
    </VStack>
  );
}
