import { NextResponse } from 'next/server';

// Helper function to handle errors and send response
const handleApiError = (error: any, message: string) => {
    console.error(message, error);
    return NextResponse.json({ error: message }, { status: 500 });
};

export default handleApiError;
