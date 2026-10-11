"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { districtCenter, initialCollections, initialMessages, properties, promotions } from "@/lib/data/mock";
import type { Collection, Message, Promotion, Property, SearchIntent, ViewingAppointment } from "@/types";

interface AppState {
  saved: string[]; toggleSave: (id: string) => void;
  follows: string[]; toggleFollow: (id: string) => void;
  collections: Collection[]; createCollection: (name: string) => string; renameCollection: (id: string, name: string) => void; deleteCollection: (id: string) => void; addToCollection: (id: string, propertyId: string) => void;
  messages: Message[]; sendMessage: (conversationId: string, body: string) => void;
  published: Property[]; publish: (property: Property) => void;
  campaigns: Promotion[]; addPromotion: (promotion: Promotion) => void;
  appointments: ViewingAppointment[]; addAppointment: (appointment: ViewingAppointment) => void;
  preferences: SearchIntent; setPreferences: (preferences: SearchIntent) => void;
  userEmail: string | null; login: (email: string) => void; logout: () => void;
}
const Context = createContext<AppState | null>(null);
type Stored = Pick<AppState, "saved" | "follows" | "collections" | "messages" | "published" | "campaigns" | "appointments" | "preferences" | "userEmail">;
const initial: Stored = { saved: ["prop-01", "prop-04", "prop-02"], follows: [], collections: initialCollections, messages: initialMessages, published: [], campaigns: promotions, appointments: [], preferences: { amenities: [] }, userEmail: null };
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Stored>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { queueMicrotask(() => { try { const saved = localStorage.getItem("urba-demo-v1"); if (saved) setState({ ...initial, ...JSON.parse(saved) as Partial<Stored> }); } catch { /* local demo state remains available */ } setHydrated(true); }); }, []);
  useEffect(() => { if (hydrated) { try { localStorage.setItem("urba-demo-v1", JSON.stringify(state)); } catch { /* storage may be full; the current session still works */ } } }, [state, hydrated]);
  const toggleSave = (id: string) => setState(s => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter(x => x !== id) : [...s.saved, id] }));
  const toggleFollow = (id: string) => setState(s => ({ ...s, follows: s.follows.includes(id) ? s.follows.filter(x => x !== id) : [...s.follows, id] }));
  const createCollection = (name: string) => { const id = `col-${Date.now()}`; setState(s => ({ ...s, collections: [{ id, name, ownerId: "demo", items: [] }, ...s.collections] })); return id; };
  const renameCollection = (id: string, name: string) => setState(s => ({ ...s, collections: s.collections.map(c => c.id === id ? { ...c, name } : c) }));
  const deleteCollection = (id: string) => setState(s => ({ ...s, collections: s.collections.filter(c => c.id !== id) }));
  const addToCollection = (id: string, propertyId: string) => setState(s => ({ ...s, collections: s.collections.map(c => c.id === id ? { ...c, items: c.items.some(i => i.propertyId === propertyId) ? c.items.filter(i => i.propertyId !== propertyId) : [...c.items, { propertyId, addedAt: new Date().toISOString() }] } : c) }));
  const sendMessage = (conversationId: string, body: string) => setState(s => ({ ...s, messages: [...s.messages, { id: `msg-${Date.now()}`, conversationId, senderId: "demo", body, sentAt: new Date().toISOString() }] }));
  const publish = (property: Property) => setState(s => ({ ...s, published: [property, ...s.published] }));
  const addPromotion = (promotion: Promotion) => setState(s => ({ ...s, campaigns: [promotion, ...s.campaigns] }));
  const addAppointment = (appointment: ViewingAppointment) => setState(s => ({ ...s, appointments: [appointment, ...s.appointments] }));
  const setPreferences = (preferences: SearchIntent) => setState(s => ({ ...s, preferences }));
  const login = (email: string) => setState(s => ({ ...s, userEmail: email }));
  const logout = () => setState(s => ({ ...s, userEmail: null }));
  return <Context.Provider value={{ ...state, toggleSave, toggleFollow, createCollection, renameCollection, deleteCollection, addToCollection, sendMessage, publish, addPromotion, addAppointment, setPreferences, login, logout }}>{children}</Context.Provider>;
}
export function useApp() { const context = useContext(Context); if (!context) throw new Error("AppStateProvider missing"); return context; }
export function allProperties(published: Property[]) {
  // Earlier demo publications used one placeholder coordinate for every district.
  // Resolve those placeholders when reading, without rewriting the saved user state.
  const located = published.map((property, index) => {
    if (property.location.lat !== -12.09 || property.location.lng !== -77.01) return property;
    const [lat, lng] = districtCenter(property.location.district);
    return { ...property, location: { ...property.location, lat: lat + (index + 1) * 0.0005, lng } };
  });
  return [...located, ...properties];
}
