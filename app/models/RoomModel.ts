import { supabase } from '../api/lib/supabaseClient'

interface RoomData {
    email: string;
    room_name: string;
}

export class RoomModel {
    static async getAll(limit?: number, offset: number = 0, textSearch?: string, order: string = 'id'): Promise<object> {
        try {
            let countQuery = supabase
                .from('room')
                .select('id', { count: 'exact' });

            if (textSearch) {
                countQuery = countQuery.or(`email.ilike.%${textSearch}%,room_name.ilike.%${textSearch}%`);
            }

            const { count, error: countError } = await countQuery;

            if (countError) {
                throw countError;
            }
            let query = supabase
                .from('room')
                .select('*')
                .order(order);

            if (textSearch) {
                query = query.or(`email.ilike.%${textSearch}%,room_name.ilike.%${textSearch}%`);
            }

            if (limit !== undefined) {
                const start = offset;
                const end = offset + limit - 1;
                query.range(start, end);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return { data, count };
        } catch (error: any) {
            console.error('Error fetching rooms:', error.message);
            return [];
        }
    }

    static async getOne(filters: { [key: string]: any }) {
        try {
            const [key, value] = Object.entries(filters)[0];
            const { data, error } = await supabase
                .from('room')
                .select('*')
                .eq(key, value)
                .single();

            if (error) {
                throw error;
            }

            if (data === null) {
                console.log(`No room found with ${key}: ${value}`);
                return null;
            }

            return data;
        } catch (error: any) {
            console.error('Error creating room:', error.message);
            return null;
        }
    }

    static async create(dataRooms: RoomData | RoomData[]): Promise<RoomData[] | null> {
        try {
            const dataToInsert = Array.isArray(dataRooms) ? dataRooms : [dataRooms];

            const { data, error } = await supabase
                .from('room')
                .insert(dataToInsert)
                .select();

            if (error) {
                throw error;
            }

            if (data && data.length > 0) {
                const roomObject = data[0];
                return roomObject;
            } else {
                console.warn('Insert successful but no data returned.');
                return null;
            }
        } catch (error: any) {
            console.error('Error creating room:', error.message);
            return null;
        }
    }

    static async update(id: number, updateData: Partial<RoomData>): Promise<RoomData | null> {
        try {

            const { data, error } = await supabase
                .from('room')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error: any) {
            console.error('Error updating room:', error.message);
            return null;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('room')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error: any) {
            console.error('Error deleting room:', error.message);
            return false;
        }
    }
}