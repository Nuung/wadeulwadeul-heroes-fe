import { NavigationMenu, Text } from "@vapor-ui/core";

export function NavMenu() {
  return (
    <NavigationMenu.Root size="md" aria-label="Navigation menu">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#"></NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">
            <Text typography="heading2">삼춘한수</Text>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#"></NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
