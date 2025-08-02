import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPlatformIcon(platform: string): string {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "📷"
    case "tiktok":
      return "🎵"
    case "youtube":
      return "📺"
    case "twitter":
      return "🐦"
    case "linkedin":
      return "💼"
    default:
      return "🌐"
  }
}

export function getContentTypeIcon(contentType: string): string {
  switch (contentType.toLowerCase()) {
    case "video":
      return "🎥"
    case "photo":
      return "📸"
    case "story":
      return "📱"
    case "reel":
      return "🎬"
    case "live":
      return "🔴"
    default:
      return "📄"
  }
}

export function formatFollowers(followers: number): string {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`
  }
  return followers.toString()
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function sanitizeSearchQuery(query: string): string {
  // Basic XSS prevention - remove script tags and other potentially dangerous content
  return query
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
}
