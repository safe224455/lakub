import { supabase } from '../api/lib/supabaseClient'
import { UserModel } from "./UserModel";
export interface AttendanceData {
    room_id: string;
    workplace: string;
}

export class AttendanceModel {
    static async getAll(): Promise<AttendanceData[] | null> {
        try {
            const { data, error } = await supabase
                .from('attendance')
                .select('*');

            if (error) {
                throw error;
            }

            return data ?? null;
        } catch (error: any) {
            console.error('Error fetching attendance:', error.message);
            return null;
        }
    }
    static async getByUserId(userId: string): Promise<AttendanceData[] | null> {
        try {
            const { data, error } = await supabase
                .from('attendance')
                .select(`
                *,
                user:user_id (
                    id,
                    fullname,
                    email
                )
            `)
                .eq('user.id', userId);
            return data ?? null;
        } catch (error: any) {
            console.error('Error fetching attendance:', error.message);
            return null;
        }
    }

    static async create(dataCreate: AttendanceData, userId: string) {
        try {


            // const { data, error } = await supabase
            //     .rpc('insert_attendance', {
            //         p_line_id: userId,
            //         p_room_id: dataToInsert.room_id,
            //         p_workplace: dataToInsert.workplace,
            //     });
            const dataToInsert = { ...dataCreate, user_id: userId };

            const { data, error } = await supabase
                .from('attendance')
                .insert(dataToInsert)
                .select();
            if (error) {
                throw error;
            }

            if (data) {
                return data; // Return the full array instead of a single object
            } else {
                console.warn('Insert successful but no data returned.');
                return null;
            }
        } catch (error: any) {
            console.error('Error creating attendance:', error.message);
            return null;
        }
    }
}
