"use client";

import { useEffect } from "react";
import {
  red,
  orange,
  yellow,
  emerald,
  sky,
  violet,
  pink,
  gray,
} from "tailwindcss/colors";

export const COLORS = [
  ...[red[100], red[200], red[300], red[400], red[500]],
  ...[orange[100], orange[200], orange[300], orange[400], orange[500]],
  ...[yellow[100], yellow[200], yellow[300], yellow[400], yellow[500]],
  ...[emerald[100], emerald[200], emerald[300], emerald[400], emerald[500]],
  ...[sky[100], sky[200], sky[300], sky[400], sky[500]],
  ...[violet[100], violet[200], violet[300], violet[400], violet[500]],
  ...[pink[100], pink[200], pink[300], pink[400], pink[500]],
  ...[gray[100], gray[200], gray[300], gray[400], gray[500]],
];

export default function useBackground() {
  useEffect(() => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    document.body.style.backgroundColor = randomColor;
  }, []);
}
