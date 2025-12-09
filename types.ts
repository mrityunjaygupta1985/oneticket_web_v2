import React from 'react';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface ScreenProps {
  isActive: boolean;
}

export interface Station {
  id: string | number;
  name: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  lines: string[];
  isInterchange?: boolean;
  localConnection?: string;
  alwaysShowLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  guide?: string;
  tip?: string;
}

export interface CityMap {
  name: string;
  type: 'image' | 'svg';
  imageUrl?: string;
  // Optional SVG content for schematic lines
  svgLayout?: React.ReactNode; 
  stations: Station[];
}