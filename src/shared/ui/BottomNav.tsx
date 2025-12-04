import { HomeIcon, TestOutlineIcon, UserOutlineIcon } from "@vapor-ui/icons";
import { Button, Text } from "@vapor-ui/core";

interface MobileBottomNavProps {
  value: string;
  onChange: (value: string) => void;
}

// 모바일 하단 네비게이션 바 (Vapor UI 기반)
export default function MobileBottomNav({
  value,
  onChange,
}: MobileBottomNavProps) {
  const items = [
    { key: "user", label: "홈", icon: <HomeIcon /> },
    { key: "#", label: "예약현황", icon: <TestOutlineIcon /> },
    { key: "#", label: "마이", icon: <UserOutlineIcon /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-surface-200 flex items-center justify-around z-50"
      style={{ backgroundColor: "#393939", height: "99px" }}
    >
      {items.map((item) => (
        <Button
          key={item.key}
          onClick={() => onChange(item.key)}
          className="flex flex-col items-center"
          colorPalette="contrast"
          backgroundColor="transparent"
          style={{
            color: value === item.key ? "#EF6F25" : "white",
            transition: "color 0.2s",
          }}
        >
          <div className="text-lg">{item.icon}</div>
          <Text
            color={value === item.key ? "color-orange-400" : "white"}
            typography="subtitle2"
          >
            {item.label}
          </Text>
        </Button>
      ))}
    </nav>
  );
}
