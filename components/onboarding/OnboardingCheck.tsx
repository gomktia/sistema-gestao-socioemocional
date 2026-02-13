'use client';

import { useState } from 'react';
import { WelcomeWizard } from './WelcomeWizard';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

interface OnboardingCheckProps {
    showWizard: boolean;
    tenantName: string;
    labels: OrganizationLabels;
}

export function OnboardingCheck({ showWizard, tenantName, labels }: OnboardingCheckProps) {
    const [visible, setVisible] = useState(showWizard);

    if (!visible) return null;

    return (
        <WelcomeWizard
            tenantName={tenantName}
            labels={labels}
            onComplete={() => setVisible(false)}
        />
    );
}
