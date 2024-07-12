import { PERCENT_REALTIME_TYPE } from "@/interfaces/enum/percent-realtime-enum";

export const constructEndpointUrl = (
  baseUrl: string,
  percentRealtime: PERCENT_REALTIME_TYPE
): string => {
  if (percentRealtime?.toString() === PERCENT_REALTIME_TYPE.SET_DEFAULT) {
    return baseUrl;
  }
  return `${baseUrl}?tier=${percentRealtime}`;
};
