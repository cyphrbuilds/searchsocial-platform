import { NextRequest, NextResponse } from 'next/server'
import https from 'node:https'

interface ApiResponse {
  ok: boolean
  status: number
  statusText: string
  json: () => Promise<any>
}

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
    
    console.log(`Making API request to: ${url}`)
    console.log(`Method: ${method}`)
    console.log(`API Key (first 10 chars): ${API_KEY.substring(0, 10)}...`)
    
    // Use node:https with SSL certificate handling
    const response: ApiResponse = await new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        // Disable SSL certificate verification for Railway
        rejectUnauthorized: false,
        strictSSL: false
      }
      
      const req = https.request(options, (res) => {
        let data = ''
        
        res.on('data', (chunk) => {
          data += chunk
        })
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data)
            resolve({
              ok: (res.statusCode || 0) >= 200 && (res.statusCode || 0) < 300,
              status: res.statusCode || 500,
              statusText: res.statusMessage || 'Unknown error',
              json: () => Promise.resolve(jsonData)
            })
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`))
          }
        })
      })
      
      req.on('error', (error) => {
        reject(error)
      })
      
      if (data && method !== 'GET') {
        req.write(JSON.stringify(data))
      }
      
      req.end()
    })
    
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
    
  } catch (error) {
    console.error('API request error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 