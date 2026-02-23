'use client';

import { useEffect, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { getStepsForRole } from './tour-steps';
import { completeTour } from '@/app/actions/tour';

interface TourGuideProps {
  userRole: string;
  showTour: boolean;
}

export function TourGuide({ userRole, showTour }: TourGuideProps) {
  const handleComplete = useCallback(async () => {
    await completeTour();
  }, []);

  useEffect(() => {
    if (!showTour) return;

    const steps = getStepsForRole(userRole);
    if (steps.length === 0) return;

    const timeout = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        progressText: '{{current}} de {{total}}',
        nextBtnText: 'Próximo',
        prevBtnText: 'Anterior',
        doneBtnText: 'Concluir',
        allowClose: true,
        animate: true,
        overlayColor: '#0f172a',
        overlayOpacity: 0.6,
        stagePadding: 8,
        stageRadius: 16,
        popoverClass: 'triavium-tour-popover',
        popoverOffset: 12,
        smoothScroll: true,
        steps,
        onDestroyStarted: () => {
          handleComplete();
          driverObj.destroy();
        },
      });

      driverObj.drive();
    }, 800);

    return () => clearTimeout(timeout);
  }, [showTour, userRole, handleComplete]);

  return null;
}
