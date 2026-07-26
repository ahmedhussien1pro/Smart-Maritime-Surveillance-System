'use client';

import { useState, useEffect } from 'react';

export interface SimData {
  // Boat
  mode: 'AUTO' | 'MANUAL';
  speed: number;
  heading: number;
  // AI
  aiDetected: boolean;
  aiFps: number;
  aiConfidence: number;
  aiTracking: boolean;
  // Power
  battery: number;
  voltage: number;
  solar: number;
  wind: number;
  hydro: number;
  // Sensors
  windSpeed: number;
  windDir: number;
  waterTemp: number;
  ph: number;
  pollution: number;
  turbidity: number;
}

function generateSimData(): SimData {
  return {
    mode: Math.random() > 0.3 ? 'AUTO' : 'MANUAL',
    speed: Math.floor(Math.random() * 80 + 10),
    heading: Math.floor(Math.random() * 360),
    aiDetected: Math.random() > 0.85,
    aiFps: Math.floor(Math.random() * 15 + 20),
    aiConfidence: Math.random() * 0.4 + 0.6,
    aiTracking: Math.random() > 0.6,
    battery: Math.floor(Math.random() * 60 + 30),
    voltage: parseFloat((Math.random() * 2 + 11).toFixed(1)),
    solar: Math.floor(Math.random() * 80 + 20),
    wind: Math.floor(Math.random() * 30 + 5),
    hydro: Math.floor(Math.random() * 20 + 5),
    windSpeed: parseFloat((Math.random() * 15 + 2).toFixed(1)),
    windDir: Math.floor(Math.random() * 360),
    waterTemp: parseFloat((Math.random() * 10 + 18).toFixed(1)),
    ph: parseFloat((Math.random() * 2 + 7).toFixed(1)),
    pollution: Math.floor(Math.random() * 50),
    turbidity: Math.floor(Math.random() * 30 + 5),
  };
}

export function useSimulation() {
  const [data, setData] = useState<SimData | null>(null);

  useEffect(() => {
    setData(generateSimData());
    const interval = setInterval(() => {
      setData(generateSimData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return { data };
}
