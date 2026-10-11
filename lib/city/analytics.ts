export interface CityViewabilityInput { cameraAngle: number; distance: number; screenVisibility: number; duration: number }
export interface CityViewability { score: number; viewable: boolean }
export function calculateBillboardViewability({ cameraAngle, distance, screenVisibility, duration }: CityViewabilityInput): CityViewability {
  const angle = Math.max(0, 1 - Math.abs(cameraAngle) / 52);
  const proximity = Math.max(0, 1 - distance / 75);
  const visible = Math.min(1, Math.max(0, screenVisibility));
  const dwell = Math.min(1, Math.max(0, duration / 1.2));
  const score = Math.round(100 * (angle * 0.32 + proximity * 0.24 + visible * 0.26 + dwell * 0.18));
  return { score, viewable: Math.abs(cameraAngle) < 38 && distance < 65 && visible >= 0.6 && duration >= 1.2 && score >= 60 };
}
export type CityEventName = "cityVisit" | "billboardImpression" | "billboardViewTime" | "billboardClick" | "propertyOpen" | "save" | "chat" | "scheduledVisit" | "visitTime";
export interface CityEvent { name: CityEventName; at: string; screenId?: string; promotionId?: string; value?: number }
const key = "urba-city-events-v1";
export function recordCityEvent(event: Omit<CityEvent, "at">) {
  try {
    const prior = JSON.parse(localStorage.getItem(key) || "[]") as CityEvent[];
    localStorage.setItem(key, JSON.stringify([...prior.slice(-499), { ...event, at: new Date().toISOString() }]));
  } catch { /* In private mode City remains usable without local analytics. */ }
}
export function readCityEvents(): CityEvent[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]") as CityEvent[]; } catch { return []; }
}
