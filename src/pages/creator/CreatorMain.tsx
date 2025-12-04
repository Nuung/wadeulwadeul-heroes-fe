import { Box, Button, HStack, Text, VStack } from "@vapor-ui/core";
import { CreatorClassList } from "./CreatorClassList";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ExperienceForm from "../ExperienceForm";
import { NavMenu } from "../user/NavMenu";

export function CreatorMain() {
  const [isExperience, setIsExperience] = useState(false);

  return (
    <>
      <NavMenu />
      <VStack>
        <Box className="w-[327px] h-[425px] mt-2">
          <img
            src="/images/creator_main.png" // 프로젝트 public 폴더 또는 URL
            alt="삼춘한수 로고"
            className="w-full h-full object-contain"
          />
        </Box>
        <Text textAlign="center" typography="heading5" render={<div />}>
          당신의 손끝에 쌓인 시간,
        </Text>
        <Text textAlign="center" typography="heading5" render={<div />}>
          섬 밖까지 닿는 가르침으로
        </Text>
        <Button
          className="w-327px m-7"
          size="lg"
          onClick={() => {
            setIsExperience(true);
          }}
        >
          클래스 만들기
        </Button>
      </VStack>
      <ExperienceForm isOpen={isExperience} setIsOpen={setIsExperience} />
    </>
  );
}
