import { NextResponse } from 'next/server';
import { RoomModel } from '../../models/RoomModel';
import { Response } from '../../response'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;
    const rooms = await RoomModel.getAll(limit, offset);
    const response = {
      result: rooms,
      message: "success",
      status_code: 200
    }
    return Response(response);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    const response = {
      result: {},
      message: `Error fetching data: ${error.message}`,
      status_code: 500
    }
    return Response(response);
  }
}

export async function POST(request: Request) {
  try {
    const roomData = await request.json();
    const room = await RoomModel.create(roomData);
    const response = {
      result: room,
      message: "success",
      status_code: 200
    }
    return Response(response);
  } catch (error: any) {
    console.error('Error creating data:', error.message);
    const response = {
      result: {},
      message: `Error creating data: ${error.message}`,
      status_code: 500
    }
    return Response(response);
  }
}