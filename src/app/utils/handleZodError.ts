import { NextResponse } from 'next/server';

interface ErrorMessageProps {
    message: string;
    path: string[]
}

// Helper function to handle errors and send response
const handleZodError = (error: any) => {
    const errorMessages = error.errors.map((errorMessage: ErrorMessageProps) => {
        return {
          message: errorMessage.message,
          field: errorMessage?.path[0],
        };
      });
      return NextResponse.json(errorMessages, { status: 400 });
};

export default handleZodError;
