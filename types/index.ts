export type Role = "visitor" | "buyer" | "owner" | "agent" | "agency" | "admin";
export type Operation = "buy" | "rent";
export type PropertyType = "Casa" | "Departamento" | "Terreno" | "Oficina" | "Local" | "Proyecto";
export type Currency = "USD" | "PEN";
export interface User { id: string; email: string; role: Role; profileId: string }
export interface Profile { id: string; name: string; username: string; avatar: string; bio?: string; district?: string }
export interface Agent extends Profile { verified: boolean; rating: number; followers: number; specialties: string[]; agencyId?: string }
export interface Agency { id: string; name: string; slug: string; logo?: string; verified: boolean }
export interface PropertyLocation { district: string; city: string; address: string; lat: number; lng: number }
export interface PropertyMedia { id: string; url: string; type: "image" | "video" | "floorplan" | "tour"; alt: string }
export interface PropertyAmenity { id: string; label: string }
export interface PropertyPriceHistory { date: string; price: number; currency: Currency }
export interface PropertyAnalytics { views: number; saves: number; shares: number; chats: number; visits: number }
export interface PropertyScore { total: number; photos: number; description: number; price: number; location: number; documentation: number; response: number }
export interface Verification { kind: "identity" | "agent" | "property" | "documents" | "address"; verifiedAt: string }
export interface Property { id: string; slug: string; title: string; description: string; operation: Operation; type: PropertyType; price: number; currency: Currency; area: number; bedrooms: number; bathrooms: number; parking: number; location: PropertyLocation; amenities: string[]; media: PropertyMedia[]; agentId: string; status: "available" | "reserved" | "sold" | "rented" | "expired" | "unverified"; verified: boolean; featured?: boolean; publishedAt: string; updatedAt: string; priceHistory: PropertyPriceHistory[]; analytics: PropertyAnalytics; score: PropertyScore }
export interface District { id: string; name: string; slug: string; searches: number; inventory: number; priceChange: number; image: string }
export interface Post { id: string; authorId: string; body: string; image?: string; propertyId?: string; likes: number; comments: number; createdAt: string }
export interface VideoPost { id: string; authorId: string; propertyId: string; title: string; cover: string; likes: number; comments: number; duration: string }
export interface Comment { id: string; postId: string; authorId: string; body: string; createdAt: string }
export interface Like { id: string; targetId: string; userId: string }
export interface Follow { id: string; followerId: string; targetId: string; targetType: "agent" | "district" | "user" | "agency" }
export interface CollectionItem { propertyId: string; addedAt: string }
export interface Collection { id: string; name: string; description?: string; ownerId: string; items: CollectionItem[]; collaborative?: boolean }
export interface Conversation { id: string; participantIds: string[]; propertyId?: string; updatedAt: string }
export interface Message { id: string; conversationId: string; senderId: string; body: string; sentAt: string }
export interface Notification { id: string; title: string; body: string; href: string; read: boolean; createdAt: string }
export interface ViewingAppointment { id: string; propertyId: string; userId: string; date: string; time: string; status: "requested" | "confirmed" | "cancelled" }
export type BillboardPlacement = "home_hero" | "feed_standard" | "feed_wide" | "explore_grid" | "district_hero" | "video_break" | "city_premium" | "map_overlay" | "agent_recommendation";
export type BillboardVariant = "property" | "agent" | "agency" | "project" | "district" | "trend" | "editorial" | "sponsored" | "brand";
export interface Billboard { id: string; variant: BillboardVariant; classification: "editorial" | "algorithmic" | "sponsored" | "trending" | "local"; title: string; subtitle: string; image: string; price?: string; cta: string; href: string; badge?: string; sponsor?: string; placement: BillboardPlacement; size: "small" | "wide" | "tall" | "hero" }
export interface PromotionAnalytics { impressions: number; views: number; clicks: number; saves: number; chats: number; visits: number; cost: number }
export interface Promotion { id: string; campaignId: string; contentId: string; contentType: "property" | "profile" | "video" | "project"; placement: BillboardPlacement; cityScreenId?: string; objective: "views" | "contacts" | "visits" | "followers"; budget: number; durationDays: number; status: "draft" | "active" | "paused" | "complete"; analytics: PromotionAnalytics }
export interface Campaign { id: string; name: string; ownerId: string; createdAt: string; promotionIds: string[] }
export interface SearchIntent { operation?: Operation; type?: PropertyType; district?: string; currency?: Currency; maxPrice?: number; minPrice?: number; bedrooms?: number; bathrooms?: number; area?: number; amenities: string[] }
