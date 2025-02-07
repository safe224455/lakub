import { supabase } from '../api/lib/supabaseClient'

interface UserData {
    email: string;
    fullname?: string;
}

export class UserModel {
    static async getAll(limit?: number, offset: number = 0, textSearch?: string, order: string = 'id'): Promise<object> {
        try {
            let countQuery = supabase
                .from('user')
                .select('id', { count: 'exact' });

            if (textSearch) {
                countQuery = countQuery.or(`email.ilike.%${textSearch}%,fullname.ilike.%${textSearch}%`);
            }

            const { count, error: countError } = await countQuery;

            if (countError) {
                throw countError;
            }

            let query = supabase
                .from('user')
                .select('*')
                .order(order);

            if (limit !== undefined) {
                const start = offset;
                const end = offset + limit - 1;
                query.range(start, end);
            }

            if (textSearch) {
                query = query.or(`email.ilike.%${textSearch}%,fullname.ilike.%${textSearch}%`);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return { data, count };
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
            return [];
        }
    }

    static async getOne(filters: { [key: string]: any }) {
        try {
            const [key, value] = Object.entries(filters)[0];
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq(key, value)
                .single();

            if (error) {
                throw error;
            }

            if (data === null) {
                console.log(`No user found with ${key}: ${value}`);
                return null;
            }

            return data;
        } catch (error: any) {
            console.error('Error creating user:', error.message);
            return null;
        }
    }

    static async create(dataUser: UserData | UserData[]): Promise<UserData[] | null> {
        try {
            const dataToInsert = Array.isArray(dataUser) ? dataUser : [dataUser];

            const { data, error } = await supabase
                .from('user')
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
            console.error('Error creating user:', error.message);
            return null;
        }
    }

    static async update(id: number, updateData: Partial<UserData>): Promise<UserData | null> {
        try {

            const { data, error } = await supabase
                .from('user')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error: any) {
            console.error('Error updating user:', error.message);
            return null;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error: any) {
            console.error('Error deleting user:', error.message);
            return false;
        }
    }

}