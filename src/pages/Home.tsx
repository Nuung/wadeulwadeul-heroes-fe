import { Card } from "@vapor-ui/core";
import { Text } from "@vapor-ui/core";

export default function Home() {
  return (
    <Card.Root className="max-w-md">
      <Card.Body backgroundColor="$orange-100">
        <div className="flex flex-col gap-4">
          <Text
            color="$primary-100"
            typography="heading1"
            foreground="normal-200"
          >
            <h1>Welcome to Vapor UI!</h1>
          </Text>
          <Text>
            이것은 Vite와 React와 함께 Vapor UI 컴포넌트를 사용하는 예시입니다.
          </Text>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
