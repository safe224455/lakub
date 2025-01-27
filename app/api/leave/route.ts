import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'leave-requests.json');
const userFile = path.join(process.cwd(), 'data', 'users.json');
const roomFile = path.join(process.cwd(), 'data', 'room.json');


export async function POST(request: Request) {
  try {
    const leaveData = await request.json();


    // Create data directory if it doesn't exist
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    // Read existing data
    let existingData = [];
    let existingUser = [];
    try {
      const fileContent = await fs.readFile(dataFile, 'utf8');
      const fileUser = await fs.readFile(userFile, 'utf8');
      existingData = JSON.parse(fileContent);
      existingUser = JSON.parse(fileUser);
      let userIndex = existingUser.findIndex((item: any) => {
        return item.id == leaveData.user_id
      })
      if (userIndex >= 0) {

        existingData.push(
          {
            ...leaveData,
            name: existingUser[userIndex].name,
            email: existingUser[userIndex].email
          });
        console.log(existingData);
        // Write updated data back to file
        await fs.writeFile(dataFile, JSON.stringify(existingData, null, 2));
        return NextResponse.json({ success: true });

      } else {
        return NextResponse.json(
          { error: 'Failed to' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: 'Failed to' },
        { status: 500 }
      );
      // File doesn't exist or is empty, start with empty array
    }

    // Add new request


  } catch (error) {
    console.error('Error processing leave request:', error);
    return NextResponse.json(
      { error: 'Failed to process leave request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('authorization')
    const roomContent = await fs.readFile(roomFile, 'utf8');
    const dataRoom = JSON.parse(roomContent);
    const resultsQuery = dataRoom.filter((item: any) => item.member.includes(userId))
    const fileContent = await fs.readFile(dataFile, 'utf8');
    const data = JSON.parse(fileContent);
    const today = new Date();
    const isTodayInRange = (item: any) => {
      const dateFrom = new Date(item.dateFrom);
      const dateTo = new Date(item.dateTo);

      dateTo.setDate(dateTo.getDate() + 1);

      return today >= dateFrom && today < dateTo;
    };
    const isMyMember = (item: any) => {
      return resultsQuery[0].member.includes(item.user_id)
    }
    const results = data.filter(isTodayInRange).filter(isMyMember);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}