import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Run the seed script
    const { execSync } = require('child_process');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}