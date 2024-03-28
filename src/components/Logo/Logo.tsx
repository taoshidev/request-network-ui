import React, { useEffect, useState, useRef } from "react";
import { Box, Center } from "@mantine/core";

import { create, set, render, frame, globe } from "@/utils/logo";

import styles from "./logo.module.css";

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 250 }: LogoProps) => {
  const [filler, setFiller] = useState("");
  const [content, setContent] = useState("");
  const hiddenRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fillerSize = size / 2;
    const initialFiller =
      "\u28ff".repeat(fillerSize) + "\n\u28ff".repeat(fillerSize - 1);
    setFiller(initialFiller);

    const animate = async () => {
      for (;;) {
        await frame();

        if (!hiddenRef.current || !rootRef.current) continue;

        const hr = hiddenRef.current.getBoundingClientRect();
        const fontWidth = hr.width / fillerSize;
        const fontHeight = hr.height / fillerSize;

        const rr = rootRef.current.getBoundingClientRect();
        const ratio = rr.width / rr.height;
        const width = (rr.width / fontWidth) << 1;
        const height = (rr.height / fontHeight) << 2;

        const pixels: number[][] = Array.from(create(width, height), (row) =>
          Array.from(row)
        );
        const time = 1e-3 * Date.now();

        for (let y = 0; y < height; y++) {
          const v = (2 * y) / height - 1;

          for (let x = 0; x < width; x++) {
            const u = ratio * ((2 * x) / width - 1);

            if (globe(x, y, u, v, time)) {
              set(pixels, x, y);
            }
          }
        }

        setContent(render(pixels));
      }
    };

    animate();
  }, []);

  return (
    <Center c="black" mb="xl">
      <Box ref={rootRef} className={styles.braille} w={size} h={size}>
        <Box
          ref={hiddenRef}
          className={styles.hidden}
          style={{ visibility: "hidden" }}
        >
          {filler}
        </Box>
        <Box>{content}</Box>
      </Box>
    </Center>
  );
};
