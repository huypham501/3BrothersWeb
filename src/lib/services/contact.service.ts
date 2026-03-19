import { GetInTouchCreatorInput, GetInTouchBrandInput } from '@/lib/validations';

export class ContactService {
  /**
   * Processes a contact form submission
   * @throws Error if already submitted or other failure
   */
  static async processSubmission(data: GetInTouchCreatorInput | GetInTouchBrandInput) {
    // TODO: Implement database check
    const alreadySubmitted = false;

    if (alreadySubmitted) {
      throw new Error('ALREADY_SUBMITTED');
    }

    // TODO: Implement actual email sending logic or DB save
    console.log('Get in touch submission processed:', data);

    return { success: true };
  }
}
