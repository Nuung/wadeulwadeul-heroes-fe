import { VStack, Text, Box } from "@vapor-ui/core";
import type { ClassTemplateData } from "../api/queries/class.types";

interface ClassTemplateProps {
  template?: ClassTemplateData | null;
}

export function ClassTemplate({ template }: ClassTemplateProps) {
  if (!template) {
    return (
      <Text typography="body1">
        입력하신 정보를 바탕으로 체험이 준비되었습니다!
      </Text>
    );
  }

  return (
    <VStack gap="$400">
      {Object.entries(template).map(([key, value]) => {
        if (!value) return null;

        return (
          <Box key={key}>
            <VStack gap="$200">
              <Text typography="subtitle1">{key}</Text>
              <Text typography="body1" style={{ whiteSpace: "pre-wrap" }}>
                {value}
              </Text>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}
