import { ServiceType } from "@/db/types/service";

export const isCrypto = (services: ServiceType[]) => {
  return (
    services.some(
      (service) =>
        service.currencyType === "USDT" || service.currencyType === "USDC"
    ) || false
  );
};
