import { NumberFormatter } from "@mantine/core";

export default function FixedFormatter({ value }) {
  return !isNaN(value) ? <NumberFormatter thousandSeparator value={+value} /> : "-";
}
