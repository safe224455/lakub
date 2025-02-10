import { supabase } from '../api/lib/supabaseClient'

export interface AttendanceData {
    room_id: string;
    user_id: string;
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
                .select('*')
                .eq('user_id', userId);

            if (error) {
                throw error;
            }

            return data ?? null;
        } catch (error: any) {
            console.error('Error fetching attendance:', error.message);
            return null;
        }
    }

    static async create(dataCreate: AttendanceData | AttendanceData[]): Promise<AttendanceData[] | null> {
        try {
            const dataToInsert = Array.isArray(dataCreate) ? dataCreate : [dataCreate];

            const { data, error } = await supabase
                .from('attendance')
                .insert(dataToInsert)
                .select();

            if (error) {
                throw error;
            }

            if (data && data.length > 0) {
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
