import { Button, HStack } from "@vapor-ui/core";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  return (
    <HStack>
      <Button onClick={() => navigate("/creator")}>클래스를 만들래요</Button>
      <Button onClick={() => navigate("/user")}>클래스에 참여할래요</Button>
    </HStack>
  );
}
