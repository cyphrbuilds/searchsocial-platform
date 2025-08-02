export interface RecentPost {
  id: number
  image: string
  date: string
  likes: number
  comments: number
  shares: number
}

export interface AudienceAge {
  "18-24": number
  "25-34": number
  "35-44": number
  "45+": number
}

export interface AudienceGender {
  male: number
  female: number
}

export interface Influencer {
  id: number
  name: string
  username: string
  image: string
  verified: boolean
  platform: string
  bio: string
  followers: number
  engagementRate: number
  rating: number
  avgLikes: number
  avgComments: number
  postCount?: number
  category: string
  contentType: string
  country: string
  language: string
  age: string
  responseTime: string
  badges: string[]
  recentPosts: RecentPost[]
  audienceAge: AudienceAge
  audienceGender: AudienceGender
}

export interface FilterOptions {
  platform: string[]
}

export interface Filters {
  platform: string
  minFollowers?: number
  maxFollowers?: number
  minEngagementRate?: number
  maxEngagementRate?: number
  interests: number[]
  languages: string[]
  geolocations: number[]
} 