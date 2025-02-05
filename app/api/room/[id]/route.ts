import { RoomModel } from '@/app/models/RoomModel';
import { Response } from '@/app/response';

export async function GET({ params }: { params: { id: string } }) { //get room detail
    try {
        const result_room = await RoomModel.getOne({ id: params.id })
        if (!result_room) {
            return Response({ result: {}, message: 'room not found', status_code: 404 })
        }
        else {
            return Response({ result: result_room, message: 'success', status_code: 200 })
        }
    } catch (error: any) {
        return Response({ result: {}, message: error.message, status_code: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) { //update room by id
    try {
        const body = await request.json();
        const updatedRoom = await RoomModel.update(Number(params.id), body);

        if (!updatedRoom) {
            return Response({ result: {}, message: 'update error', status_code: 400 });
        }

        return Response({ result: updatedRoom, message: 'success', status_code: 200 });
    } catch (error: any) {
        return Response({ result: {}, message: error.message, status_code: 500 });
    }
}

export async function DELETE({ params }: { params: { id: string } }) { //delete room by id
    try {
        const result_room = await RoomModel.delete(Number(params.id))
        if (!result_room) {
            return Response({ result: {}, message: 'delete error', status_code: 400 })
        }
        else {
            return Response({ result: result_room, message: 'success', status_code: 200 })
        }
    } catch (error: any) {
        return Response({ result: {}, message: error.message, status_code: 500 })
    }
}

