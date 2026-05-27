export type CounterStat = {
  kind: "counter";
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

export type StaticStat = {
  kind: "static";
  label: string;
  display: string;
};

export type SiteStat = CounterStat | StaticStat;

export function isCounterStat(stat: SiteStat): stat is CounterStat {
  return stat.kind === "counter";
}
