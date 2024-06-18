import { NumberFormatter } from "@mantine/core";

export default function CurrencyFormatter({ price, currencyType }) {
  return +(price || 0) === 0 ? (
    "FREE"
  ) : (
    <NumberFormatter
      prefix={
        {
          FIAT: "$",
          USDC: "USDC ",
          USDT: "USDT ",
          none: "",
        }[currencyType || "none"]
      }
      thousandSeparator
      fixedDecimalScale
      value={+(price || 0)}
      decimalScale={2}
    />
  );
}
