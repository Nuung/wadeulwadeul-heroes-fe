import MobileBottomNav from "@/shared/ui/BottomNav";
import { Box, Tabs } from "@vapor-ui/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserMain() {
  const [currPath, setCurrPath] = useState("user");
  const navigation = useNavigate();
  const onChange = (value: string) => {
    setCurrPath(value);
    navigation(`/${value}`);
  };

  return (
    <>
      <MobileBottomNav value={currPath} onChange={onChange} />
    </>
  );
}
