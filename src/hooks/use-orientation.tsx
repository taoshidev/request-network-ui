import { useEventListener } from "@react-hookz/web";
import { useState } from "react";

export const useOrientation = (desktopWidth: number) => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const initOrientation = width < desktopWidth ? "vertical" : "horizontal";

  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    initOrientation
  );

  const changeOrientation = () => {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const newOrientation = width < desktopWidth ? "vertical" : "horizontal";

    if (newOrientation !== orientation) {
      setOrientation(newOrientation);
    }
  };

  useEventListener(window, "resize", changeOrientation, { passive: true });
  useEventListener(window, "orientationchange", changeOrientation, {
    passive: true,
  });

  return orientation;
};
