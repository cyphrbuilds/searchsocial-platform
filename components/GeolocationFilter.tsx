import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MapPin, Search, X } from "lucide-react"

interface Geolocation {
  id: number
  name: string
  title: string
}

interface GeolocationFilterProps {
  geolocations: Geolocation[]
  selectedGeolocations: number[]
  onGeolocationToggle: (geolocationId: number, isSelected: boolean) => void
  geolocationQuery: string
  onGeolocationQueryChange: (query: string) => void
  loading?: boolean
}

export function GeolocationFilter({
  geolocations,
  selectedGeolocations,
  onGeolocationToggle,
  geolocationQuery,
  onGeolocationQueryChange,
  loading = false
}: GeolocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedCount = selectedGeolocations.length

  // Get selected location details for display
  const selectedLocationDetails = selectedGeolocations.map(id => {
    const location = geolocations.find(loc => loc.id === id)
    return location || { id, name: `Location ${id}`, title: `Location ${id}` }
  })

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGeolocationQueryChange(e.target.value)
  }

  const handleClearQuery = () => {
    onGeolocationQueryChange("")
  }

  const handleGeolocationSelect = (geolocationId: number, isSelected: boolean) => {
    onGeolocationToggle(geolocationId, isSelected)
  }

  const handleClearAll = () => {
    selectedGeolocations.forEach(geolocationId => {
      onGeolocationToggle(geolocationId, false)
    })
  }

  const handleRemoveLocation = (geolocationId: number) => {
    onGeolocationToggle(geolocationId, false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-gray-300 text-gray-700 hover:bg-white bg-transparent"
        >
          <MapPin className="h-3 w-3 mr-1" />
          Locations
          {selectedCount > 0 && (
            <span className="ml-1 bg-black text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px]">
              {selectedCount}
            </span>
          )}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-gray-200 w-[400px] max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-sm font-medium text-gray-900 px-3 py-2">
          Search Locations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Search Input */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              placeholder="Type to search locations..."
              value={geolocationQuery}
              onChange={handleInputChange}
              className="pl-10 pr-8 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black"
            />
            {geolocationQuery && (
              <button
                onClick={handleClearQuery}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Locations */}
        {selectedLocationDetails.length > 0 && (
          <>
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-gray-700 mb-2">Selected Locations:</div>
              <div className="grid grid-cols-2 gap-2">
                {selectedLocationDetails.map((location) => (
                  <Badge
                    key={location.id}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 p-2 h-auto w-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate flex-1 mr-1 min-w-0" title={location.title}>
                        {location.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveLocation(location.id)
                        }}
                        className="hover:text-red-600 flex-shrink-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Results */}
        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Searching locations...</div>
          ) : geolocationQuery && geolocations.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No locations found</div>
          ) : geolocations.length > 0 ? (
            geolocations.map((geolocation) => {
              const isSelected = selectedGeolocations.includes(geolocation.id)
              return (
                <div
                  key={geolocation.id}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleGeolocationSelect(geolocation.id, !isSelected)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleGeolocationSelect(geolocation.id, !isSelected)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {geolocation.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {geolocation.title}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              Start typing to search locations
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {selectedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-gray-600 hover:text-black"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 