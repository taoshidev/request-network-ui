export enum PERCENT_REALTIME_TYPE {
  SET_DEFAULT = "-1",
  ZERO_PERCENT_REALTIME = "0",
  THIRTY_PERCENT_REALTIME = "30",
  FIFTY_PERCENT_REALTIME = "50",
  HUNDRED_PERCENT_REALTIME = "100",
}

export const PERCENT_REALTIME_LABEL: Record<PERCENT_REALTIME_TYPE, string> = {
  [PERCENT_REALTIME_TYPE.SET_DEFAULT]: "Set Default",
  [PERCENT_REALTIME_TYPE.ZERO_PERCENT_REALTIME]:
    "0% of positions real-time - 100% of positions 24-hour lagged",
  [PERCENT_REALTIME_TYPE.THIRTY_PERCENT_REALTIME]:
    "30% of positions real-time - 70% of positions 24-hour lagged",
  [PERCENT_REALTIME_TYPE.FIFTY_PERCENT_REALTIME]:
    "50% of positions real-time - 50% of positions 24-hour lagged",
  [PERCENT_REALTIME_TYPE.HUNDRED_PERCENT_REALTIME]:
    "100% of positions real-time - 0% of positions 24-hour lagged",
};

export const PercentRealtimeOptions = Object.entries(PERCENT_REALTIME_LABEL).map(([value, label]) => ({
    value,
    label,
  }));
  