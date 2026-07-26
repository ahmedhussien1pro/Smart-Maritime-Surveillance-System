'use client';

import { BoatStatusCard } from './cards/BoatStatusCard';
import { CameraFeedCard } from './cards/CameraFeedCard';
import { RadarCard } from './cards/RadarCard';
import { AIStatusCard } from './cards/AIStatusCard';
import { PowerMonitorCard } from './cards/PowerMonitorCard';
import { SensorsCard } from './cards/SensorsCard';
import { ManualControlCard } from './cards/ManualControlCard';
import { NotificationsCard } from './cards/NotificationsCard';
import { useSocket } from '@/hooks/useSocket';

export function DashboardGrid() {
  const { boatState, aiState, radarState, notifications, lastAck, sendCommand } = useSocket();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
      {/* Row 1: Camera Feed (2 Cols) + Tactical Radar (1 Col) */}
      <div className="xl:col-span-2">
        <CameraFeedCard aiState={aiState} />
      </div>
      <div>
        <RadarCard radarState={radarState} boatState={boatState} />
      </div>

      {/* Row 2: Boat Telemetry + AI Vision Status + Manual Control */}
      <BoatStatusCard data={boatState} />
      <AIStatusCard data={aiState} />
      <ManualControlCard sendCommand={sendCommand} speed={boatState.speed} />

      {/* Row 3: Power Grid + Environmental Sensors + System Notifications */}
      <PowerMonitorCard data={boatState} />
      <SensorsCard data={boatState} />
      <NotificationsCard notifications={notifications} ackMessage={lastAck} sendCommand={sendCommand} />
    </div>
  );
}
