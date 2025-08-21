import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async authorize(rideId: number, amount: number) {
    return { status: 'authorized', providerRef: `AUTH-${rideId}`, amount };
  }
  async capture(rideId: number) {
    return { status: 'captured', providerRef: `CAP-${rideId}` };
  }
}
