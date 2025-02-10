import { UserModel } from '../../models/UserModel';
import { Response } from '../../response'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const users = await UserModel.getAll(limit, offset);
    const response = {
      result: users,
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
    const userData = await request.json()
    const users = await UserModel.create(userData);
    const response = {
      result: users,
      message: 'success',
      status_code: 201
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