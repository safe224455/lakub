import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();

    // Create data directory if it doesn't exist
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

    // Read existing data
    let existingData = [];
    try {
      const fileContent = await fs.readFile(dataFile, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
    }

    // Add new request
    existingData.push({ ...bodyData, status: false });

    // Write updated data back to file
    await fs.writeFile(dataFile, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing leave request:', error);
    return NextResponse.json(
      { error: 'Failed to process leave request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFile, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}