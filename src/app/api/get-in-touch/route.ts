import { NextRequest, NextResponse } from 'next/server';
import { getInTouchCreatorSchema, getInTouchBrandSchema } from '@/lib/validations';
import { ContactService } from '@/lib/services/contact.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate based on isCreator flag
    const schema = body.isCreator === 1 
      ? getInTouchCreatorSchema 
      : getInTouchBrandSchema;
    
    const validatedData = schema.parse(body);

    await ContactService.processSubmission(validatedData);

    return NextResponse.json(
      { message: 'Thanks! We\'ll get back to you as soon as we can.', success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get in touch error:', error);
    
    if (error instanceof Error && error.message === 'ALREADY_SUBMITTED') {
      return NextResponse.json(
        { message: 'You have already submitted.' },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
