import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_SEARCHSOCIAL_API_KEY
  
  if (!API_KEY) {
    return NextResponse.json({ 
      success: false, 
      error: 'API key not configured' 
    }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { endpoint, method = 'GET', data } = body
    
    const url = `https://searchsocial.ai/api/v1${endpoint}`
    
    const config: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
    
    if (data && method !== 'GET') {
      config.body = JSON.stringify(data)
    }
    
    console.log(`Making API request to: ${url}`)
    console.log(`Method: ${method}`)
    console.log(`API Key (first 10 chars): ${API_KEY.substring(0, 10)}...`)
    
    // Temporarily disable SSL verification for Railway environment
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    
    try {
      const response = await fetch(url, config)
      
      console.log(`Response status: ${response.status}`)
      
      const responseData = await response.json()
      
      if (!response.ok) {
        console.error(`API request failed: ${response.status} ${response.statusText}`)
        console.error(`Error response:`, responseData)
        return NextResponse.json({
          success: false,
          error: responseData.detail || response.statusText,
          status: response.status
        }, { status: response.status })
      }
      
      return NextResponse.json({
        success: true,
        data: responseData
      })
    } finally {
      // Restore original SSL verification setting
      if (originalRejectUnauthorized !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
      }
    }
    
  } catch (error) {
    console.error('API request error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 