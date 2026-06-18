import React from 'react';
export const MapContainer = ({ children }: any) => <div>{children}</div>;
export const TileLayer = () => null;
export const Marker = ({ children }: any) => <div>{children}</div>;
export const Popup = ({ children }: any) => <div>{children}</div>;
export const useMap = () => ({
  setView: () => {},
});
