import React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Tag } from "lucide-react"

interface Interest {
  interest_id: number
  name: string
}

interface InterestsFilterProps {
  interests: Interest[]
  selectedInterests: number[]
  onInterestToggle: (interestId: number, isSelected: boolean) => void
  loading?: boolean
}

export function InterestsFilter({
  interests,
  selectedInterests,
  onInterestToggle,
  loading = false
}: InterestsFilterProps) {
  const selectedCount = selectedInterests.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-gray-300 text-gray-700 hover:bg-white bg-transparent"
          disabled={loading}
        >
          <Tag className="h-3 w-3 mr-1" />
          Interests
          {selectedCount > 0 && (
            <span className="ml-1 bg-black text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px]">
              {selectedCount}
            </span>
          )}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-gray-200 max-h-96 overflow-y-auto min-w-[250px]">
        <DropdownMenuLabel className="text-sm font-medium text-gray-900 px-3 py-2">
          Select Interests
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="px-3 py-2 text-sm text-gray-500">Loading interests...</div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.interest_id)
              return (
                <div
                  key={interest.interest_id}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onInterestToggle(interest.interest_id, !isSelected)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onInterestToggle(interest.interest_id, !isSelected)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <label className="text-sm text-gray-700 cursor-pointer flex-1">
                    {interest.name}
                  </label>
                </div>
              )
            })}
          </div>
        )}
        {selectedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-gray-600 hover:text-black"
                onClick={() => {
                  selectedInterests.forEach(interestId => {
                    onInterestToggle(interestId, false)
                  })
                }}
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