import { Tabs, Text } from "@vapor-ui/core";

export function CategoryTab() {
  const tabs = ["홈", "돌담", "감귤", "해녀", "요리", "목공"];
  return (
    <Tabs.Root defaultValue="홈" activateOnFocus={true}>
      <Tabs.List size="lg" className="px-5">
        {tabs.map((value) => {
          return (
            <Tabs.Trigger key={value} value={value} className="py-6">
              <Text color="tabs-content-color" typography="subtitle1">
                {" "}
                {value}
              </Text>
            </Tabs.Trigger>
          );
        })}

        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
