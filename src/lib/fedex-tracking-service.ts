'use client';

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: 'In Transit' | 'Delivered' | 'Exception' | 'Pending';
  estimatedDelivery?: string;
  actualDelivery?: string;
  events: TrackingEvent[];
  lastUpdated: string;
}

// Mock FedEx tracking service - in production, this would integrate with FedEx API
export class FedExTrackingService {
  // Simulate API delay
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getTrackingInfo(trackingNumber: string): Promise<TrackingInfo | null> {
    await this.delay(500); // Simulate API call delay

    // Mock tracking data based on tracking number pattern
    // In production, this would call the actual FedEx API
    const mockData = this.generateMockTrackingData(trackingNumber);
    return mockData;
  }

  async batchTrackingInfo(trackingNumbers: string[]): Promise<Map<string, TrackingInfo>> {
    const results = new Map<string, TrackingInfo>();
    
    // Process in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < trackingNumbers.length; i += batchSize) {
      const batch = trackingNumbers.slice(i, i + batchSize);
      const promises = batch.map(async (trackingNumber) => {
        const info = await this.getTrackingInfo(trackingNumber);
        if (info) {
          results.set(trackingNumber, info);
        }
      });
      
      await Promise.all(promises);
      await this.delay(100); // Rate limiting delay
    }
    
    return results;
  }

  private generateMockTrackingData(trackingNumber: string): TrackingInfo {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 5) + 1;
    const shipDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Determine status based on tracking number (for demo purposes)
    const lastDigit = parseInt(trackingNumber.slice(-1)) || 0;
    const isDelivered = lastDigit % 3 === 0;
    const isInTransit = lastDigit % 3 === 1;
    
    let status: TrackingInfo['status'];
    let actualDelivery: string | undefined;
    let estimatedDelivery: string | undefined;
    
    if (isDelivered) {
      status = 'Delivered';
      actualDelivery = new Date(shipDate.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString();
    } else if (isInTransit) {
      status = 'In Transit';
      estimatedDelivery = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString();
    } else {
      status = 'Pending';
      estimatedDelivery = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString();
    }

    const events: TrackingEvent[] = [
      {
        timestamp: shipDate.toISOString(),
        status: 'Picked up',
        location: 'Origin facility',
        description: 'Package picked up by FedEx'
      }
    ];

    if (status === 'In Transit' || status === 'Delivered') {
      events.push({
        timestamp: new Date(shipDate.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'In transit',
        location: 'Sorting facility',
        description: 'Package in transit'
      });
    }

    if (status === 'Delivered') {
      events.push({
        timestamp: actualDelivery!,
        status: 'Delivered',
        location: 'Destination',
        description: 'Package delivered'
      });
    }

    return {
      trackingNumber,
      status,
      estimatedDelivery,
      actualDelivery,
      events,
      lastUpdated: now.toISOString()
    };
  }

  calculateInspectionDate(deliveryDate: string): string {
    const delivery = new Date(deliveryDate);
    const inspectionDate = new Date(delivery.getTime() + (2 * 24 * 60 * 60 * 1000));
    return inspectionDate.toISOString();
  }
}

export const fedexTrackingService = new FedExTrackingService();
