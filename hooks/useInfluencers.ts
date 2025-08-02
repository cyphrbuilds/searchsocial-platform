import { useState, useEffect, useCallback, useMemo } from "react"
import { Influencer, Filters } from "@/types"
import { SearchSocialAPI, SearchParams, convertAPIInfluencerToInternal } from "@/lib/api"
import { sanitizeSearchQuery } from "@/lib/utils"

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    platform: "All Platforms",
    interests: [],
    languages: [],
    geolocations: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [interests, setInterests] = useState<Array<{ interest_id: number; name: string }>>([])
  const [interestsLoading, setInterestsLoading] = useState(false)
  const [languages, setLanguages] = useState<Array<{ code: string; name: string }>>([])
  const [languagesLoading, setLanguagesLoading] = useState(false)
  const [geolocations, setGeolocations] = useState<Array<{ id: number; name: string; title: string }>>([])
  const [geolocationsLoading, setGeolocationsLoading] = useState(false)
  const [geolocationQuery, setGeolocationQuery] = useState("")
  const [debouncedGeolocationQuery, setDebouncedGeolocationQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch()
    }
  }, [debouncedSearchQuery])

  // Fetch interests on component mount
  useEffect(() => {
    const fetchInterests = async () => {
      setInterestsLoading(true)
      try {
        const response = await SearchSocialAPI.getInterests()
        if (response.success) {
          setInterests(response.interests)
        } else {
          console.error("Failed to fetch interests:", response.message)
          setError("Failed to load interests. Please try again.")
        }
      } catch (err) {
        console.error("Error fetching interests:", err)
        setError("Network error loading interests. Please check your connection.")
      } finally {
        setInterestsLoading(false)
      }
    }

    fetchInterests()
  }, [])

  // Fetch languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      setLanguagesLoading(true)
      try {
        const response = await SearchSocialAPI.getLanguages('instagram')
        if (response.success) {
          setLanguages(response.languages)
        } else {
          console.error("Failed to fetch languages:", response.message)
          setError("Failed to load languages. Please try again.")
        }
      } catch (err) {
        console.error("Error fetching languages:", err)
        setError("Network error loading languages. Please check your connection.")
      } finally {
        setLanguagesLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  // Debounce geolocation query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGeolocationQuery(geolocationQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [geolocationQuery])

  // Fetch geolocations when query changes
  useEffect(() => {
    const fetchGeolocations = async () => {
      if (!debouncedGeolocationQuery.trim()) {
        setGeolocations([])
        return
      }

      setGeolocationsLoading(true)
      try {
        const response = await SearchSocialAPI.getGeolocations('instagram', debouncedGeolocationQuery, 10)
        setGeolocations(response)
      } catch (err) {
        console.error("Error fetching geolocations:", err)
        setGeolocations([])
      } finally {
        setGeolocationsLoading(false)
      }
    }

    fetchGeolocations()
  }, [debouncedGeolocationQuery])

  const getAPIParams = useCallback((query: string, currentFilters: Filters): SearchParams => {
    const params: SearchParams = {
      limit: 10
    }

    if (query.trim()) {
      params.query = query.trim()
    }

    if (currentFilters.platform && currentFilters.platform !== "All Platforms") {
      params.platform = currentFilters.platform.toLowerCase()
    }

    if (currentFilters.minFollowers) {
      params.min_followers = currentFilters.minFollowers
    }

    if (currentFilters.maxFollowers) {
      params.max_followers = currentFilters.maxFollowers
    }

    if (currentFilters.minEngagementRate) {
      params.min_engagement_rate = currentFilters.minEngagementRate
    }

    if (currentFilters.maxEngagementRate) {
      params.max_engagement_rate = currentFilters.maxEngagementRate
    }

    if (currentFilters.interests && currentFilters.interests.length > 0) {
      params.interests = currentFilters.interests
    }

    if (currentFilters.languages && currentFilters.languages.length > 0) {
      params.languages = currentFilters.languages
    }

    if (currentFilters.geolocations && currentFilters.geolocations.length > 0) {
      params.geolocations = currentFilters.geolocations
    }

    return params
  }, [])

  const searchInfluencers = useCallback(async (params: SearchParams, append: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const response = await SearchSocialAPI.searchInfluencers(params)

      if (response.success) {
        const convertedInfluencers = response.influencers.map(convertAPIInfluencerToInternal)

        if (append) {
          setInfluencers(prev => [...prev, ...convertedInfluencers])
        } else {
          setInfluencers(convertedInfluencers)
        }

        setHasMore(response.has_more)
        setNextCursor(response.next_cursor)
        setTotalCount(response.total_count)
      } else {
        setError(response.message || "Search failed")
      }
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while searching")
    } finally {
      setLoading(false)
    }
  }, [])

  const performSearch = useCallback(async () => {
    const params = getAPIParams(searchQuery, filters)
    await searchInfluencers(params)
  }, [searchQuery, filters, getAPIParams, searchInfluencers])

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return

    const params = getAPIParams(searchQuery, filters)
    params.cursor = nextCursor
    await searchInfluencers(params, true)
  }, [nextCursor, loading, searchQuery, filters, getAPIParams, searchInfluencers])

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    )
  }, [])

  const updateFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateNumericFilter = useCallback((key: keyof Filters, value: number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateInterests = useCallback((interestId: number, isSelected: boolean) => {
    setFilters(prev => ({
      ...prev,
      interests: isSelected 
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }))
  }, [])

  const updateLanguages = useCallback((languageCode: string, isSelected: boolean) => {
    setFilters(prev => ({
      ...prev,
      languages: isSelected 
        ? [...prev.languages, languageCode]
        : prev.languages.filter(code => code !== languageCode)
    }))
  }, [])

  const updateGeolocations = useCallback((geolocationId: number, isSelected: boolean) => {
    setFilters(prev => ({
      ...prev,
      geolocations: isSelected 
        ? [...prev.geolocations, geolocationId]
        : prev.geolocations.filter(id => id !== geolocationId)
    }))
  }, [])

  return {
    influencers,
    favorites,
    searchQuery,
    setSearchQuery,
    filters,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount,
    toggleFavorite,
    updateFilter,
    updateNumericFilter,
    updateInterests,
    updateLanguages,
    updateGeolocations,
    interests,
    interestsLoading,
    languages,
    languagesLoading,
    geolocations,
    geolocationsLoading,
    geolocationQuery,
    setGeolocationQuery,
    performSearch
  }
} 