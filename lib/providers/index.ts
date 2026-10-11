import type { Property, Promotion, SearchIntent, ViewingAppointment } from "@/types";
import { filterProperties, parseSearch } from "@/lib/domain";
export interface AIPropertySearchProvider { interpret(query: string): Promise<SearchIntent>; search(intent: SearchIntent): Promise<Property[]> }
export class MockAIPropertySearchProvider implements AIPropertySearchProvider { async interpret(query: string) { return parseSearch(query); } async search(intent: SearchIntent) { return filterProperties(intent); } }
export interface MapProvider { getCenter(district?: string): [number, number]; getMarker(property: Property): { lat: number; lng: number; label: string } }
export class MockMapProvider implements MapProvider { getCenter(): [number, number] { return [-12.11, -77.01]; } getMarker(property: Property) { return { lat: property.location.lat, lng: property.location.lng, label: property.location.district }; } }
export interface AuthProvider { signIn(email: string): Promise<{ id: string; email: string }>; signOut(): Promise<void> }
export class MockAuthProvider implements AuthProvider { async signIn(email: string) { return { id: "demo", email }; } async signOut() {} }
export interface PromotionProvider { launch(promotion: Promotion): Promise<Promotion> }
export class MockPromotionProvider implements PromotionProvider { async launch(promotion: Promotion) { return { ...promotion, status: "active" as const }; } }
export interface ViewingProvider { request(appointment: ViewingAppointment): Promise<ViewingAppointment> }
export class MockViewingProvider implements ViewingProvider { async request(appointment: ViewingAppointment) { return { ...appointment, status: "requested" as const }; } }
export interface StorageProvider { upload(file: File): Promise<string> }
export class MockStorageProvider implements StorageProvider { async upload(file: File) { return URL.createObjectURL(file); } }
export interface PaymentProvider { checkout(amount: number): Promise<{ status: "demo"; amount: number }> }
export class MockPaymentProvider implements PaymentProvider { async checkout(amount: number) { return { status: "demo" as const, amount }; } }
export const providers = { search: new MockAIPropertySearchProvider(), map: new MockMapProvider(), auth: new MockAuthProvider(), promotion: new MockPromotionProvider(), viewing: new MockViewingProvider(), storage: new MockStorageProvider(), payment: new MockPaymentProvider() };
