import { Button, HStack, VStack, Text } from "@vapor-ui/core";
import { USER_STORAGE_KEY } from "@/shared/api";
import { useNavigate } from "react-router-dom";

const OLD_USER_ID = "550e8400-e29b-41d4-a716-446655440002";
const YOUNG_USER_ID = "550e8400-e29b-41d4-a716-446655440011";

export default function Main() {
  const navigate = useNavigate();

  const setUserSession = (userId: string) => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.setItem(USER_STORAGE_KEY, userId);
    } catch (error) {
      console.error("Failed to persist user session", error);
    }
  };

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
          onClick={() => {
            setUserSession(OLD_USER_ID);
            navigate("/creator");
          }}
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
          onClick={() => {
            setUserSession(YOUNG_USER_ID);
            navigate("/user");
          }}
        >
          클래스에 참여할래요
        </Button>
      </VStack>
    </VStack>
  );
}
