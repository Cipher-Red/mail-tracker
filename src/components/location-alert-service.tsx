'use client';

import { useEffect } from 'react';
import { ReturnedPart } from './returned-parts-manager';
import { useNotificationStore } from '@/lib/notification-store';
interface LocationAlertServiceProps {
  parts: ReturnedPart[];
}
export default function LocationAlertService({
  parts
}: LocationAlertServiceProps) {
  const {
    addNotification
  } = useNotificationStore();
  useEffect(() => {
    const checkLocationAlerts = () => {
      parts.forEach(part => {
        if (!part.dropOffTime || !part.deliveryLocation) return;
        const dropOffTime = new Date(part.dropOffTime);
        const now = new Date();
        const hoursElapsed = (now.getTime() - dropOffTime.getTime()) / (1000 * 60 * 60);

        // Alert if parts have been at location for more than 24 hours without arrival
        if (hoursElapsed > 24 && part.status !== 'arrived') {
          addNotification({
            type: 'arrival_due',
            title: 'Parts Overdue at Location',
            message: `${part.partName} (${part.partNumber}) has been at ${part.deliveryLocation.replace('_', ' ').toUpperCase()} for over 24 hours without arrival confirmation`,
            priority: 'high',
            partId: part.id
          });
        }

        // Alert if parts arrived but inspection is due
        if (part.arrivedDate && !part.inspectionDate) {
          const arrivedDate = new Date(part.arrivedDate);
          const inspectionDue = new Date(arrivedDate.getTime() + 2 * 24 * 60 * 60 * 1000);
          if (now >= inspectionDue) {
            addNotification({
              type: 'inspection_due',
              title: 'Inspection Overdue',
              message: `${part.partName} (${part.partNumber}) inspection is overdue. Arrived on ${arrivedDate.toLocaleDateString()}`,
              priority: 'urgent',
              partId: part.id
            });
          }
        }

        // Alert when parts are expected to arrive soon
        if (part.expectedArrival && part.status === 'in_transit') {
          const expectedDate = new Date(part.expectedArrival);
          const daysDiff = Math.ceil((expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 1 && daysDiff >= 0) {
            addNotification({
              type: 'arrival_due',
              title: 'Parts Expected to Arrive',
              message: `${part.partName} (${part.partNumber}) is expected to arrive ${daysDiff === 0 ? 'today' : 'tomorrow'} at ${part.deliveryLocation?.replace('_', ' ').toUpperCase()}`,
              priority: 'medium',
              partId: part.id
            });
          }
        }

        // Alert for parts that have been in transit too long
        if (part.status === 'in_transit' && part.shippedDate) {
          const shippedDate = new Date(part.shippedDate);
          const daysInTransit = Math.ceil((now.getTime() - shippedDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysInTransit > 7) {
            addNotification({
              type: 'urgent_issue',
              title: 'Parts Long Overdue',
              message: `${part.partName} (${part.partNumber}) has been in transit for ${daysInTransit} days. Expected at ${part.deliveryLocation?.replace('_', ' ').toUpperCase()}`,
              priority: 'urgent',
              partId: part.id
            });
          }
        }
      });
    };

    // Run check immediately
    checkLocationAlerts();

    // Set up interval to check every hour
    const interval = setInterval(checkLocationAlerts, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [parts, addNotification]);
  return null; // This is a service component, no UI
}