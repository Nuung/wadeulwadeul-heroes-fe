import { NavigationMenu, Text } from "@vapor-ui/core";

interface NavMenuProps {
  width?: string;
}

export function NavMenu({ width }: NavMenuProps) {
  return (
    <NavigationMenu.Root size="md" aria-label="Navigation menu">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#"></NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/">
            <img src="/images/logo.png" width={width ? width : "150"} />
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#"></NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
