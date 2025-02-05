import { NextResponse } from 'next/server';

interface responseData {
    result?: any;
    status_code?: number;
    message?: string;
}

export async function Response(responseData: responseData) {
    try {
        return NextResponse.json({ result: responseData.result || {}, message: responseData.message || "success" }, { status: responseData.status_code || 200 });
    } catch (error: any) {
        return NextResponse.json({ result: {}, message: error.message }, { status: 500 });
    }
}