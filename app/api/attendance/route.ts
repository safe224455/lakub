import { AttendanceModel } from '@/app/models/AttendanceModel';
import { Response } from '@/app/response';

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();
    try {
      let result = await AttendanceModel.create(bodyData);
      return Response({ result: result, message: 'success', status_code: 200 })

    } catch (error: any) {
      console.log(error);
      return Response({ result: {}, message: error.message, status_code: 500 })
    }
  } catch (error) {
    console.error('Error processing leave request:', error);
    return Response({ result: {}, message: 'Failed to process leave request', status_code: 500 })
  }
}

