import { ServiceType } from "@/db/types/service";

export const isCrypto = (services: ServiceType[] | ServiceType) => {
  return Array.isArray(services)
    ? services?.some(
        (service) =>
          service.currencyType === "USDT" || service.currencyType === "USDC"
      )
    : services
    ? services.currencyType === "USDT" || services.currencyType === "USDC"
    : false;
};
