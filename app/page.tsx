"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/Navigation"
import { InfluencerCard } from "@/components/InfluencerCard"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { LoadingSpinner, LoadingCard } from "@/components/LoadingSpinner"
import { InterestsFilter } from "@/components/InterestsFilter"
import { LanguagesFilter } from "@/components/LanguagesFilter"
import { GeolocationFilter } from "@/components/GeolocationFilter"
import { useInfluencers } from "@/hooks/useInfluencers"
import { filterOptions } from "@/data/mockData"
import {
  Search,
  ChevronDown,
  Users,
  Eye,
  Download,
  Award,
  Zap,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Heart,
  TrendingUp,
  ThumbsUp,
  Globe,
} from "lucide-react"
import { getPlatformIcon, getContentTypeIcon, formatFollowers } from "@/lib/utils"
import { Influencer } from "@/types"

export default function SearchSocial() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Debug environment variables on client side
  useEffect(() => {
    console.log('=== CLIENT SIDE ENV DEBUG ===')
    console.log('API Key available:', !!process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY)
    console.log('API Key length:', process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY?.length || 0)
    console.log('=== END CLIENT DEBUG ===')
  }, [])

  // Test API function
  const testAPI = async () => {
    console.log('=== TESTING API ===')
    try {
      const response = await fetch('https://searchsocial.ai/api/v1/social/interests?hide_deprecated=true', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY}`,
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (!response.ok) {
        console.error('API request failed:', response.status, response.statusText)
        console.error('Error data:', data)
      } else {
        console.log('API request successful!')
      }
    } catch (error) {
      console.error('API test error:', error)
    }
  }

  const {
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
  } = useInfluencers()

  const downloadReport = () => {
    if (!selectedInfluencer) return

    try {
      const element = document.createElement("a")
      const file = new Blob(
        [
          `Influencer Report - ${selectedInfluencer.name}\n\nFollowers: ${selectedInfluencer.followers}\nEngagement Rate: ${selectedInfluencer.engagementRate}%\nPlatform: ${selectedInfluencer.platform}\nCategory: ${selectedInfluencer.category}\nCountry: ${selectedInfluencer.country}`,
        ],
        { type: "text/plain" },
      )
      element.href = URL.createObjectURL(file)
      element.download = `${selectedInfluencer.name.replace(" ", "_")}_Report.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error("Failed to download report:", error)
    }
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    try {
      await loadMore()
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navigation 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />

        {/* Filters Section */}
        <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-32 justify-between border-gray-300 text-gray-700 hover:bg-white bg-transparent"
                    >
                      {filters.platform}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-gray-200">
                    {filterOptions.platform.map((option: string) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => updateFilter("platform", option)}
                        className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Enter keywords, niches or categories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black"
                    aria-label="Search influencers"
                  />
                </div>

                <Button
                  onClick={performSearch}
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 text-white px-6"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Numeric Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Min Followers</label>
                <Input
                  type="number"
                  placeholder="e.g., 10000"
                  value={filters.minFollowers || ""}
                  onChange={(e) => updateNumericFilter("minFollowers", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Followers</label>
                <Input
                  type="number"
                  placeholder="e.g., 50000"
                  value={filters.maxFollowers || ""}
                  onChange={(e) => updateNumericFilter("maxFollowers", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Min Engagement Rate (%)</label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={filters.minEngagementRate || ""}
                  onChange={(e) => updateNumericFilter("minEngagementRate", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Engagement Rate (%)</label>
                <Input
                  type="number"
                  placeholder="e.g., 20"
                  value={filters.maxEngagementRate || ""}
                  onChange={(e) => updateNumericFilter("maxEngagementRate", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <InterestsFilter
                interests={interests}
                selectedInterests={filters.interests}
                onInterestToggle={updateInterests}
                loading={interestsLoading}
              />
              <LanguagesFilter
                languages={languages}
                selectedLanguages={filters.languages}
                onLanguageToggle={updateLanguages}
                loading={languagesLoading}
              />
              <GeolocationFilter
                geolocations={geolocations}
                selectedGeolocations={filters.geolocations}
                onGeolocationToggle={updateGeolocations}
                geolocationQuery={geolocationQuery}
                onGeolocationQueryChange={setGeolocationQuery}
                loading={geolocationsLoading}
              />
              {(filters.interests.length > 0 || filters.languages.length > 0 || filters.geolocations.length > 0 || 
                filters.minFollowers || filters.maxFollowers || filters.minEngagementRate || filters.maxEngagementRate) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateFilter("platform", "All Platforms")
                    filters.interests.forEach(interestId => updateInterests(interestId, false))
                    filters.languages.forEach(langCode => updateLanguages(langCode, false))
                    filters.geolocations.forEach(geoId => updateGeolocations(geoId, false))
                    setSearchQuery("")
                  }}
                  className="h-8 border-gray-300 text-gray-700 hover:bg-white bg-transparent"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Discover Influencers</h2>
            <p className="text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : `${totalCount} creators found`}
            </p>
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            {/* Debug button - remove in production */}
            <button 
              onClick={testAPI}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm"
            >
              Test API (Debug)
            </button>
          </div>

          {/* Loading State */}
          {loading && influencers.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          )}

          {/* Influencer Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {influencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  isFavorite={favorites.includes(influencer.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={(influencer) => {
                    setSelectedInfluencer(influencer)
                  }}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && influencers.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No influencers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}

          {/* Load More Button */}
          {influencers.length > 0 && hasMore && (
            <div className="text-center mt-12">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white" onClick={handleLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Load More Influencers
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Detail Modal */}
        <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)}>
          <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto bg-white border-gray-200 text-black p-4 sm:p-6">
            {selectedInfluencer && (
              <>
                <DialogHeader className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-black flex items-center flex-wrap gap-2">
                      {selectedInfluencer.name}
                    </DialogTitle>
                    <Button
                      onClick={downloadReport}
                      className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                  {/* Left Column - Profile Overview */}
                  <div className="xl:col-span-1 space-y-4 sm:space-y-6">
                    {/* Profile Image */}
                    <div className="relative">
                      <Avatar className="w-full h-60 sm:h-80 rounded-xl">
                        <AvatarImage
                          src={selectedInfluencer.image || "/placeholder.svg"}
                          alt={selectedInfluencer.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-xl h-60 sm:h-80 text-2xl sm:text-3xl bg-gray-100 text-gray-600">
                          {selectedInfluencer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Status Badges */}
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
                        {selectedInfluencer.badges.map((badge) => (
                          <Badge
                            key={badge}
                            className={`text-xs sm:text-sm border-0 ${
                              badge === "Top Creator" ? "bg-black text-white" : "bg-gray-800 text-white"
                            }`}
                          >
                            {badge === "Top Creator" ? (
                              <Award className="h-3 w-3 mr-1" />
                            ) : (
                              <Zap className="h-3 w-3 mr-1" />
                            )}
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      {/* Platform Badge */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                        <Badge className="bg-gray-100 text-gray-700 border border-gray-200 text-xs sm:text-sm">
                          <span>{getPlatformIcon(selectedInfluencer.platform)}</span>
                          <span className="ml-1 sm:ml-2">{selectedInfluencer.platform}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-semibold text-black">@{selectedInfluencer.username}</h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${
                              i < Math.floor(selectedInfluencer.rating) ? "fill-black text-black" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-base sm:text-lg font-medium text-black">{selectedInfluencer.rating}</span>
                      <span className="text-xs sm:text-sm text-gray-500">(4.2k reviews)</span>
                    </div>

                    {/* Bio */}
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                      <h3 className="font-semibold text-black mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <Users className="h-4 w-4 mr-2" />
                        About
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{selectedInfluencer.bio}</p>
                    </div>

                    {/* Location & Category */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-700">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                        <MapPin className="h-4 w-4" />
                        {selectedInfluencer.country}
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                        <span>{getContentTypeIcon(selectedInfluencer.contentType)}</span>
                        {selectedInfluencer.category}
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Response Time: {selectedInfluencer.responseTime}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white text-sm sm:text-base">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Creator
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent text-sm sm:text-base"
                        onClick={() => toggleFavorite(selectedInfluencer.id)}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            favorites.includes(selectedInfluencer.id) ? "fill-black text-black" : "text-gray-600"
                          }`}
                        />
                        {favorites.includes(selectedInfluencer.id) ? "Saved" : "Save Creator"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - Analytics & Posts */}
                  <div className="xl:col-span-2 space-y-6 sm:space-y-8">
                    {/* Key Metrics */}
                    <div>
                      <h3 className="font-semibold text-black mb-4 sm:mb-6 text-lg sm:text-xl flex items-center">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Key Metrics
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center border border-gray-200">
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-lg sm:text-2xl font-bold text-black">
                            {formatFollowers(selectedInfluencer.followers)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="bg-black p-4 sm:p-6 rounded-xl text-center">
                          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white mx-auto mb-2" />
                          <div className="text-lg sm:text-2xl font-bold text-white">{selectedInfluencer.engagementRate.toFixed(1)}%</div>
                          <div className="text-xs sm:text-sm text-gray-300">Engagement</div>
                        </div>
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center border border-gray-200">
                          <ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-lg sm:text-2xl font-bold text-black">
                            {formatFollowers(selectedInfluencer.avgLikes)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">Avg Likes</div>
                        </div>
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center border border-gray-200">
                          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-lg sm:text-2xl font-bold text-black">{selectedInfluencer.avgComments}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Avg Comments</div>
                        </div>
                      </div>
                    </div>

                    {/* Platform Details */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <h3 className="font-semibold text-black mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Platform Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Primary Platform</div>
                          <div className="font-medium text-black flex items-center text-sm sm:text-base">
                            <span>{getPlatformIcon(selectedInfluencer.platform)}</span>
                            <span className="ml-2">{selectedInfluencer.platform}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Content Type</div>
                          <div className="font-medium text-black flex items-center text-sm sm:text-base">
                            <span>{getContentTypeIcon(selectedInfluencer.contentType)}</span>
                            <span className="ml-2">{selectedInfluencer.contentType}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Language</div>
                          <div className="font-medium text-black text-sm sm:text-base">{selectedInfluencer.language}</div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Age Group</div>
                          <div className="font-medium text-black text-sm sm:text-base">{selectedInfluencer.age}</div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <h3 className="font-semibold text-black mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Engagement Breakdown
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                              <span className="text-gray-700">Likes</span>
                              <span className="text-gray-700 font-medium">85%</span>
                            </div>
                            <Progress value={85} className="h-2 sm:h-3 bg-gray-200" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                              <span className="text-gray-700">Comments</span>
                              <span className="text-gray-700 font-medium">12%</span>
                            </div>
                            <Progress value={12} className="h-2 sm:h-3 bg-gray-200" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                              <span className="text-gray-700">Shares</span>
                              <span className="text-gray-700 font-medium">3%</span>
                            </div>
                            <Progress value={3} className="h-2 sm:h-3 bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Audience Demographics */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <h3 className="font-semibold text-black mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Audience Demographics
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Age Distribution */}
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4">Age Distribution</h4>
                          <div className="space-y-2 sm:space-y-3">
                            {Object.entries(selectedInfluencer.audienceAge).map(([age, percentage]) => (
                              <div key={age} className="flex items-center gap-2 sm:gap-3">
                                <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-600">{age}</div>
                                <div className="flex-1">
                                  <Progress value={percentage} className="h-1.5 sm:h-2 bg-gray-200" />
                                </div>
                                <div className="w-8 sm:w-12 text-xs sm:text-sm text-gray-600 text-right font-medium">{percentage}%</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gender Split */}
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4">Gender Split</h4>
                          <div className="space-y-2 sm:space-y-3">
                            {Object.entries(selectedInfluencer.audienceGender).map(([gender, percentage]) => (
                              <div key={gender} className="flex items-center gap-2 sm:gap-3">
                                <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-600 capitalize">{gender}</div>
                                <div className="flex-1">
                                  <Progress value={percentage} className="h-1.5 sm:h-2 bg-gray-200" />
                                </div>
                                <div className="w-8 sm:w-12 text-xs sm:text-sm text-gray-600 text-right font-medium">{percentage}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  )
} 