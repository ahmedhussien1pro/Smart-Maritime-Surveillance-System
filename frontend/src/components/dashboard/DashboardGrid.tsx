'use client';

import { BoatStatusCard } from './cards/BoatStatusCard';
import { CameraFeedCard } from './cards/CameraFeedCard';
import { AIStatusCard } from './cards/AIStatusCard';
import { PowerMonitorCard } from './cards/PowerMonitorCard';
import { SensorsCard } from './cards/SensorsCard';
import { ManualControlCard } from './cards/ManualControlCard';
import { NotificationsCard } from './cards/NotificationsCard';
import { useSimulation } from '@/hooks/useSimulation';

export function DashboardGrid() {
  const { data } = useSimulation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
      {/* Row 1: Camera (large) + Boat Status + AI Status */}
      <div className="md:col-span-2 xl:col-span-2">
        <CameraFeedCard />
      </div>
      <div className="flex flex-col gap-4">
        <BoatStatusCard data={data} />
        <AIStatusCard data={data} />
      </div>

      {/* Row 2: Power + Sensors + Manual Control */}
      <PowerMonitorCard data={data} />
      <SensorsCard data={data} />
      <ManualControlCard />

      {/* Row 3: Notifications - full width */}
      <div className="md:col-span-2 xl:col-span-3">
        <NotificationsCard data={data} />
      </div>
    </div>
  );
}
