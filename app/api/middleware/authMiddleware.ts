import { RoomUserModel } from "@/app/models/RoomUserModel";
import { UserModel } from "../../models/UserModel";

export async function authMiddleware(request: Request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    let user = await UserModel.getOne({ line_id: token })
    let room = await RoomUserModel.getOne({ user_id: user.id })
    if (!user) {
        return { authorized: false, error: 'Unauthorized' };
    }
    try {

        return { user, room, authorized: true, error: null };
    } catch (error) {
        return { authorized: false, error: 'Auth failed' };
    }
}
