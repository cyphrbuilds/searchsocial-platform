# SearchSocial - Influencer Discovery Platform

A modern, responsive web application for discovering and connecting with social media influencers across multiple platforms.

## 🚀 Features

- **Advanced Search & Filtering**: Search by keywords, niches, or categories with multiple filter options
- **Comprehensive Influencer Profiles**: Detailed analytics, engagement metrics, and audience demographics
- **Multi-Platform Support**: Instagram, TikTok, YouTube, and Twitter influencers
- **Responsive Design**: Mobile-first approach with excellent UX across all devices
- **Real-time Filtering**: Instant search results with multiple filter criteria
- **Favorites System**: Save and manage your favorite influencers
- **Detailed Analytics**: Engagement breakdown, audience demographics, and performance metrics
- **Export Functionality**: Download influencer reports for further analysis

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useMemo, useCallback)
- **Build Tool**: Next.js built-in bundler

## 📁 Project Structure

```
searchsocial-platform/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with metadata
│   ├── loading.tsx          # Loading component
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Navigation.tsx       # Navigation component
│   ├── InfluencerCard.tsx   # Influencer card component
│   ├── ErrorBoundary.tsx    # Error handling component
│   └── LoadingSpinner.tsx   # Loading states
├── data/
│   └── mockData.ts          # Mock influencer data
├── hooks/
│   └── useInfluencers.ts    # Custom hook for data management
├── lib/
│   └── utils.tsx            # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd searchsocial-platform
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Components

### Navigation Component
- Responsive navigation with mobile menu
- Search functionality
- Platform filtering

### InfluencerCard Component
- Displays influencer information in a card format
- Favorite functionality
- Click to view detailed profile

### ErrorBoundary Component
- Graceful error handling
- User-friendly error messages
- Development mode error details

### Custom Hooks
- `useInfluencers`: Manages influencer data, filtering, and search
- Proper memoization for performance
- Type-safe operations

## 🔧 Configuration

### TypeScript
The project uses strict TypeScript configuration with proper type definitions for all data structures.

### Tailwind CSS
Custom styling with Tailwind CSS classes and responsive design patterns.

### Next.js Configuration
- App Router for modern React patterns
- Static generation for better performance
- Optimized images and assets

## 📊 Data Structure

### Influencer Interface
```typescript
interface Influencer {
  id: number
  name: string
  bio: string
  category: string
  country: string
  followers: number
  engagementRate: number
  platform: string
  contentType: string
  gender: string
  age: string
  ethnicity: string
  language: string
  badges: string[]
  rating: number
  image: string
  avgLikes: number
  avgComments: number
  avgShares: number
  audienceAge: AudienceAge
  audienceGender: AudienceGender
  verified: boolean
  responseTime: string
  recentPosts: RecentPost[]
}
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Accessibility**: ARIA labels and semantic HTML
- **Responsive**: Works on all screen sizes
- **Interactive**: Smooth animations and transitions
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 🔍 Search & Filtering

### Available Filters
- **Platform**: Instagram, TikTok, YouTube, Twitter
- **Content Type**: Photos, Videos, Stories, Reels
- **Followers**: 1K-10K, 10K-100K, 100K-1M, 1M+
- **Location**: Multiple countries
- **Gender**: Male, Female, Non-binary
- **Age**: 18-24, 25-34, 35-44, 45+
- **Ethnicity**: Various ethnic backgrounds
- **Language**: Multiple languages

### Search Functionality
- Real-time search across name, category, and bio
- Sanitized input to prevent XSS attacks
- Case-insensitive matching

## 📈 Analytics & Metrics

### Key Metrics Displayed
- Follower count with formatting (K, M)
- Engagement rate percentage
- Average likes and comments
- Response time
- Rating with star display

### Audience Demographics
- Age distribution with progress bars
- Gender split visualization
- Geographic location
- Language preferences

## 🛡️ Security Features

- Input sanitization for search queries
- XSS prevention
- Type-safe operations
- Error boundaries for graceful failure handling

## 🚀 Performance Optimizations

- Memoized filtering and search
- Optimized re-renders with React.memo
- Efficient state management
- Static generation where possible
- Optimized bundle size

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Modular component architecture

### Testing
- Component-based architecture for easy testing
- Error boundaries for error handling
- Loading states for better UX

## 📝 Future Enhancements

- [ ] Authentication system
- [ ] Database integration
- [ ] Real-time data updates
- [ ] Advanced analytics dashboard
- [ ] API endpoints for data management
- [ ] User preferences and settings
- [ ] Export to various formats (PDF, CSV)
- [ ] Integration with social media APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS 