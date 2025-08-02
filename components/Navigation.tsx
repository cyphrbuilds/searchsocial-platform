"use client"

import { Search, Zap, TrendingUp, Users, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black">SearchSocial</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Zap className="h-4 w-4 mr-2" />
                How It Works
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Login
              </a>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
              Join as Brand
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white">
              Join as Creator
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-black"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="text-gray-600 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              How It Works
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Login
            </a>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                Join as Brand
              </Button>
              <Button className="w-full bg-black hover:bg-gray-800 text-white">
                Join as Creator
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 