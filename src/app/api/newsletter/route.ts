import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    // TODO: Check if already subscribed (database check)
    const alreadySubscribed = false;

    if (alreadySubscribed) {
      return NextResponse.json(
        { message: 'You have already submitted.' },
        { status: 400 }
      );
    }

    // TODO: Add to email list service (e.g., Mailchimp, SendGrid)
    console.log('Newsletter subscription:', validatedData);

    return NextResponse.json(
      { message: 'Thanks! We\'ll get back to you as soon as we can.', success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter error:', error);
    
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
