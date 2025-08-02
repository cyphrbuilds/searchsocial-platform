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
import { ChevronDown, Languages } from "lucide-react"

interface Language {
  code: string
  name: string
}

interface LanguagesFilterProps {
  languages: Language[]
  selectedLanguages: string[]
  onLanguageToggle: (languageCode: string, isSelected: boolean) => void
  loading?: boolean
}

export function LanguagesFilter({
  languages,
  selectedLanguages,
  onLanguageToggle,
  loading = false
}: LanguagesFilterProps) {
  const selectedCount = selectedLanguages.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-gray-300 text-gray-700 hover:bg-white bg-transparent"
          disabled={loading}
        >
          <Languages className="h-3 w-3 mr-1" />
          Languages
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
          Select Languages
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="px-3 py-2 text-sm text-gray-500">Loading languages...</div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {languages.map((language) => {
              const isSelected = selectedLanguages.includes(language.code)
              return (
                <div
                  key={language.code}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onLanguageToggle(language.code, !isSelected)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onLanguageToggle(language.code, !isSelected)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <label className="text-sm text-gray-700 cursor-pointer flex-1">
                    {language.name}
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
                  selectedLanguages.forEach(languageCode => {
                    onLanguageToggle(languageCode, false)
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