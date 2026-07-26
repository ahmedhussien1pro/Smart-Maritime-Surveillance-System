'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface BoatState {
  mode: 'AUTO' | 'MANUAL';
  speed: number;
  heading: number;
  battery: number;
  voltage: number;
  solar: number;
  wind: number;
  hydro: number;
  lat: number;
  lng: number;
  connected: boolean;
}

export interface AIState {
  detected: boolean;
  class: string | null;
  confidence: number;
  tracking: boolean;
  fps: number;
  bbox?: { x: number; y: number; width: number; height: number } | null;
}

export interface RadarTarget {
  id: string;
  distance: number;
  angle: number;
  type: string;
  threat: 'DANGER' | 'WARNING' | 'NEUTRAL' | 'FRIENDLY';
  speed: number;
}

export interface RadarState {
  sweepAngle: number;
  targets: RadarTarget[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  timestamp: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [boatState, setBoatState] = useState<BoatState>({
    mode: 'AUTO',
    speed: 35,
    heading: 90,
    battery: 92,
    voltage: 12.4,
    solar: 70,
    wind: 15,
    hydro: 10,
    lat: 27.9654,
    lng: 34.3615,
    connected: true,
  });

  const [aiState, setAiState] = useState<AIState>({
    detected: true,
    class: 'Enemy Speedboat',
    confidence: 0.89,
    tracking: true,
    fps: 29,
    bbox: { x: 38, y: 28, width: 24, height: 26 },
  });

  const [radarState, setRadarState] = useState<RadarState>({
    sweepAngle: 45,
    targets: [
      { id: 'T-101', distance: 85, angle: 45, type: 'Enemy Speedboat', threat: 'DANGER', speed: 28 },
      { id: 'T-102', distance: 190, angle: 210, type: 'Cargo Ship', threat: 'NEUTRAL', speed: 12 },
    ],
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: '1',
      title: 'AI Alert',
      message: 'Enemy Speedboat detected in Sector 4',
      severity: 'danger',
      timestamp: '14:22:10',
    },
    {
      id: '2',
      title: 'System Info',
      message: 'Navigation mode set to AUTO',
      severity: 'info',
      timestamp: '14:20:00',
    },
  ]);

  const [lastAck, setLastAck] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      query: { type: 'dashboard' },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to Maritime Socket Backend');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket Backend');
      setIsConnected(false);
    });

    socket.on('boat:state', (data: BoatState) => setBoatState(data));
    socket.on('ai:state', (data: AIState) => setAiState(data));
    socket.on('radar:state', (data: RadarState) => setRadarState(data));

    socket.on('notification', (notif: SystemNotification) => {
      setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
    });

    socket.on('command:ack', (ack: { command: string; ts: number }) => {
      setLastAck(`Command '${ack.command}' acknowledged at ${new Date(ack.ts).toLocaleTimeString()}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendCommand = useCallback((command: string, payload: Record<string, unknown> = {}) => {
    if (socketRef.current) {
      socketRef.current.emit('command', { command, ...payload, timestamp: Date.now() });
    }
  }, []);

  return {
    isConnected,
    boatState,
    aiState,
    radarState,
    notifications,
    lastAck,
    sendCommand,
  };
}
