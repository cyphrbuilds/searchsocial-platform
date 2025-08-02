const API_BASE_URL = 'https://searchsocial.ai/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY || ''

// API Response Types
export interface APIUser {
  user_id: string
  username: string
  display_name: string
  profile_picture_url: string
  is_verified: boolean
  is_private: boolean
  platform: string
  bio: string | null
  follower_count: number
  following_count: number | null
  post_count: number | null
  engagement_rate: number
  avg_likes: number | null
  avg_comments: number | null
  location: string | null
  website: string | null
  email: string | null
  phone: string | null
  business_category: string | null
  is_business: boolean
  external_url: string | null
  created_at: string | null
  last_post_date: string | null
}

export interface APIInfluencer {
  user: APIUser
  audience_demographics: unknown | null
  content_categories: string[]
  brand_collaborations: unknown[]
  avg_engagement_rate: number
  audience_quality_score: number | null
  collaboration_rate: number | null
  contact_info: unknown | null
}

export interface SearchFilters {
  followers?: {
    left_number: number
    right_number: number
  }
  engagement_rate?: {
    value: number
    operator: string
  }
  text?: string
}

export interface SearchResponse {
  success: boolean
  message: string | null
  total_count: number
  has_more: boolean
  next_cursor: string | null
  influencers: APIInfluencer[]
  search_filters: SearchFilters
}

export interface SearchParams {
  query?: string
  platform?: string
  min_followers?: number
  max_followers?: number
  min_engagement_rate?: number
  max_engagement_rate?: number
  cursor?: string
  limit?: number
  interests?: number[]
  languages?: string[]
  geolocations?: number[]
}

export interface Interest {
  interest_id: number
  name: string
  category: string | null
  brands: string[]
}

export interface InterestsResponse {
  success: boolean
  message: string | null
  interests: Interest[]
}

export interface Language {
  code: string
  name: string
  native_name: string | null
  supported_platforms: string[]
}

export interface LanguagesResponse {
  success: boolean
  message: string | null
  languages: Language[]
}

export interface Geolocation {
  id: number
  type: string[]
  name: string
  title: string
  country: {
    id: number
    code: string
  }
}

// API Service
export class SearchSocialAPI {
  private static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  static async getInterests(): Promise<InterestsResponse> {
    const response = await this.makeRequest('/social/interests?hide_deprecated=true') as InterestsResponse
    return response
  }

  static async getLanguages(platform: string = 'instagram'): Promise<LanguagesResponse> {
    const response = await this.makeRequest(`/social/languages?platform=${platform}`) as LanguagesResponse
    return response
  }

  static async getGeolocations(platform: string = 'instagram', query: string, limit: number = 10): Promise<Geolocation[]> {
    const response = await this.makeRequest(`/social/geolocations?platform=${platform}&query=${encodeURIComponent(query)}&limit=${limit}`) as Geolocation[]
    return response
  }

  static async searchInfluencers(params: SearchParams): Promise<SearchResponse> {
    // Build request body, only including non-empty values
    const requestBody: Record<string, unknown> = {}
    
    if (params.query) requestBody.query = params.query
    if (params.platform) requestBody.platform = params.platform
    if (params.min_followers) requestBody.min_followers = params.min_followers
    if (params.max_followers) requestBody.max_followers = params.max_followers
    if (params.min_engagement_rate) requestBody.min_engagement_rate = params.min_engagement_rate
    if (params.max_engagement_rate) requestBody.max_engagement_rate = params.max_engagement_rate
    if (params.cursor) requestBody.cursor = params.cursor
    if (params.limit) requestBody.limit = params.limit
    if (params.interests && params.interests.length > 0) requestBody.interests = params.interests
    if (params.languages && params.languages.length > 0) requestBody.languages = params.languages
    if (params.geolocations && params.geolocations.length > 0) requestBody.geolocations = params.geolocations

    const response = await this.makeRequest('/social/search/influencers', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }) as SearchResponse

    return response
  }
}

// Utility function to convert API response to our internal format
export function convertAPIInfluencerToInternal(apiInfluencer: APIInfluencer) {
  const user = apiInfluencer.user
  
  return {
    id: parseInt(user.user_id) || Math.random(), // Fallback for empty user_id
    name: user.display_name || user.username,
    username: user.username,
    image: user.profile_picture_url,
    verified: user.is_verified,
    platform: user.platform,
    bio: user.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    followers: user.follower_count,
    engagementRate: user.engagement_rate,
    rating: 4.5, // Default rating since API doesn't provide this
    avgLikes: user.avg_likes || 0,
    avgComments: user.avg_comments || 0,
    postCount: user.post_count || 0,
    category: "General", // Default category
    contentType: "Photos", // Default content type
    country: user.location || "Unknown",
    language: "English", // Default language
    age: "18-34", // Default age group
    responseTime: "2-4 hours", // Default response time
    badges: [],
    recentPosts: [], // API doesn't provide recent posts
    audienceAge: { "18-24": 30, "25-34": 40, "35-44": 20, "45+": 10 },
    audienceGender: { "male": 45, "female": 55 },
  }
} 