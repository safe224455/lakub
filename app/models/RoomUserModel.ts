import { supabase } from '../api/lib/supabaseClient'

interface RoomUserData {
    email: string;
    room_name: string;
}

export class RoomUserModel {

    static async getOne(filters: { [key: string]: any }) {
        try {
            const [key, value] = Object.entries(filters)[0];
            const { data, error } = await supabase
                .from('roomuser')
                .select('*')
                .eq(key, value)
                .single();

            if (error) {
                throw error;
            }

            if (data === null) {
                console.log(`No roomuser found with ${key}: ${value}`);
                return null;
            }

            return data;
        } catch (error: any) {
            console.error('Error creating roomuser:', error.message);
            return null;
        }
    }

}