import { AttendanceModel } from '@/app/models/AttendanceModel';
import { Response } from '@/app/response';

export async function GET({ params }: { params: { id: string } }) { //get room detail
    try {
        const result = await AttendanceModel.getByUserId(params.id)
        if (!result) {
            return Response({ result: {}, message: 'room not found', status_code: 404 })
        }
        else {
            return Response({ result: result, message: 'success', status_code: 200 })
        }
    } catch (error: any) {
        return Response({ result: {}, message: error.message, status_code: 500 })
    }
}




