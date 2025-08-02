import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY
  
  try {
    const response = await fetch('https://searchsocial.ai/api/v1/social/interests?hide_deprecated=true', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data,
      apiKeyLength: API_KEY?.length || 0,
      apiKeyFirst10: API_KEY?.substring(0, 10) || 'none'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyLength: API_KEY?.length || 0,
      apiKeyFirst10: API_KEY?.substring(0, 10) || 'none'
    })
  }
} 