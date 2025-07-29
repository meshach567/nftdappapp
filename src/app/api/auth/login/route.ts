import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { address, signature } = await request.json();

    if (!address || !signature) {
      return NextResponse.json(
        { error: 'Address and signature are required' },
        { status: 400 }
      );
    }

    // Verify the signature
    const message = `I want to access the premium dashboard. Address: ${address}. Timestamp: ${Date.now()}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        address: address.toLowerCase(),
        timestamp: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    const userData = {
      address: address.toLowerCase(),
      authenticated: true,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 