import { NavigationMenu, Text } from "@vapor-ui/core";

interface NavMenuProps {
  width?: string;
  isSplash?: boolean;
}

export function NavMenu({ width, isSplash }: NavMenuProps) {
  return (
    <NavigationMenu.Root size="md" aria-label="Navigation menu">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/" justifyContent="space-between">
            {!isSplash && (
              <img src="/images/logo.png" width={width ? width : "150"} />
            )}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/">
            {isSplash && (
              <img src="/images/logo.png" width={width ? width : "150"} />
            )}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#"></NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
