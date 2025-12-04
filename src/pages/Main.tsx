import { Button, HStack, VStack, Text } from "@vapor-ui/core";
import { USER_STORAGE_KEY } from "@/shared/api";
import { useNavigate } from "react-router-dom";
import { NavMenu } from "./user/NavMenu";

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
    items-center 
    justify-between
    gap-10
    px-6
    py-6
  "
    >
      {/* 상단 로고 영역 */}
      <VStack className="items-center gap-2 mt-50">
        <NavMenu />
        <Text className="text-surface-500 text-sm">한 수 배워가는 공간</Text>
      </VStack>

      {/* 하단 버튼 영역 */}
      <VStack className="w-full gap-2 mb-6">
        <Button
          className="w-full py-6 text-white"
          size="xl"
          color="$primary-200"
          onClick={() => {
            setUserSession(OLD_USER_ID);
            navigate("/creator");
          }}
        >
          클래스 만들기
        </Button>

        <Button
          className="w-full py-6 text-white"
          size="xl"
          backgroundColor="#393939"
          onClick={() => {
            setUserSession(YOUNG_USER_ID);
            navigate("/user");
          }}
        >
          클래스 참여하기
        </Button>
      </VStack>
    </VStack>
  );
}
