import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasApiKey: !!process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY,
    apiKeyLength: process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY?.length || 0,
    allEnvVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC'))
  })
} 