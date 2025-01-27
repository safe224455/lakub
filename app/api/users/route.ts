import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'users.json');
import { supabase } from '../lib/supabaseClient'

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
  // try {
  //   const fileContent = await fs.readFile(dataFile, 'utf8');
  //   const data = JSON.parse(fileContent);
  //   return NextResponse.json(data);
  // } catch (error) {
  //   return NextResponse.json([], { status: 200 });
  // }
  try {
    // Fetch data from Supabase table
    const { data, error } = await supabase.from('user').select();
    console.log(data)
    console.log(error)
    if (error) {

      throw error; // Throw the error if Supabase returns one
    }

    // Return the data as JSON
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    // Return empty array with status 200 in case of error
    return NextResponse.json([], { status: 200 });
  }
}