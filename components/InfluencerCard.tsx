"use client"

import { Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Influencer } from "@/types"
import { getPlatformIcon, getContentTypeIcon, formatFollowers, formatNumber } from "@/lib/utils"

interface InfluencerCardProps {
  influencer: Influencer
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
  onClick: (influencer: Influencer) => void
}

export function InfluencerCard({ 
  influencer, 
  isFavorite, 
  onToggleFavorite, 
  onClick 
}: InfluencerCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(influencer.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(influencer)
    }
  }

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onClick(influencer)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${influencer.name}'s profile`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={influencer.image || "/placeholder.svg"} alt={influencer.name} />
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {influencer.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-black text-sm">{influencer.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>@{influencer.username}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{getPlatformIcon(influencer.platform)}</span>
              <span>{influencer.platform}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteClick}
          className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-black text-black" : "text-gray-400"
            }`}
          />
        </Button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {influencer.verified && (
          <Badge className="text-xs border-0 bg-black text-white">
            Verified
          </Badge>
        )}
        {influencer.badges.slice(0, 2).map((badge) => (
          <Badge
            key={badge}
            className={`text-xs border-0 ${
              badge === "Top Creator" ? "bg-black text-white" : "bg-gray-800 text-white"
            }`}
          >
            {badge}
          </Badge>
        ))}
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{influencer.bio}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-black">{formatFollowers(influencer.followers)}</div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-black">{influencer.engagementRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-black">{influencer.postCount || 0}</div>
          <div className="text-xs text-gray-500">Posts</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm font-bold text-black">{formatNumber(influencer.avgLikes)}</div>
          <div className="text-xs text-gray-500">Avg Likes</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-black">{formatNumber(influencer.avgComments)}</div>
          <div className="text-xs text-gray-500">Avg Comments</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{influencer.country}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{getContentTypeIcon(influencer.contentType)}</span>
          <span>{influencer.contentType}</span>
        </div>
      </div>
    </div>
  )
} 