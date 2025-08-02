import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-600`} />
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-1 mb-3">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-3 bg-gray-200 rounded w-12"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
        </div>
      </div>
    </div>
  )
} 