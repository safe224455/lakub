import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'users.json');

type ProfileShow = {
    name: string,
    email: string,
    roomCode: string
    status: boolean
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {

        const bodyData = await request.json();

        // Create data directory if it doesn't exist
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

        // Read existing data
        let existingData = [];
        try {
            const fileContent = await fs.readFile(dataFile, 'utf8');
            existingData = JSON.parse(fileContent);
            let userIndex = existingData.findIndex((item: any) => {
                return item.email == bodyData.email && item.roomCode == bodyData.roomCode
            })
            if (userIndex >= 0) {
                existingData[userIndex] = {
                    ...existingData[userIndex],
                    id: params.id,
                    ...bodyData,
                    status: true
                }
            } else {
                return NextResponse.json(
                    { error: 'Failed to' },
                    { status: 500 }
                );
            }
        } catch (error) {
            // File doesn't exist or is empty, start with empty array
        }

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const fileContent = await fs.readFile(dataFile, 'utf8');
        const data = JSON.parse(fileContent);
        console.log(params.id);

        let userIndex = data.findIndex((item: any) => {
            return item.id == params.id
        })
        if (userIndex >= 0) {
            let userData: ProfileShow = {
                name: data[userIndex].name,
                email: data[userIndex].email,
                roomCode: data[userIndex].roomCode,
                status: data[userIndex].status,
            };
            return NextResponse.json(userData);
        } else {
            return NextResponse.json(
                { error: 'Failed to' },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}