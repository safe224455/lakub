import { AttendanceModel } from '@/app/models/AttendanceModel';
import { Response } from '@/app/response';
import { authMiddleware } from '../middleware/authMiddleware';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await authMiddleware(request);
        const { searchParams } = new URL(request.url);
        if (!auth.authorized) {
            return Response({ result: {}, message: auth.error || 'Unauthorized', status_code: 401 });
        }
        let result: any
        if (searchParams.get('mode') == "month") {
            result = await AttendanceModel.getByDate(searchParams.get('date') || new Date().toISOString().split('T')[0], auth.user.id)
        }
        else {
            result = await AttendanceModel.getByUserId(auth.user.id)
        }

        if (!result) {
            return Response({ result: {}, message: 'User not fond', status_code: 404 })
        }
        else {
            return Response({ result: result, message: 'success', status_code: 200 })
        }
    } catch (error: any) {
        return Response({ result: {}, message: error.message, status_code: 500 })
    }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await authMiddleware(request);
        if (!auth.authorized) {
            return Response({ result: {}, message: auth.error || 'Unauthorized', status_code: 401 });
        }
        const bodyData = await request.json();
        try {
            let result = await AttendanceModel.create({ ...bodyData, room_id: auth.room.room_id }, auth.user.id);
            return Response({ result: result, message: 'success', status_code: 200 })

        } catch (error: any) {
            console.log(error);
            return Response({ result: {}, message: error.message, status_code: 500 })
        }
    } catch (error) {
        console.error('Error processing attendance request:', error);
        return Response({ result: {}, message: 'Failed to process attendance request', status_code: 500 })
    }
}



