import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Leaflet from 'leaflet';

const TILES = {
  DEFAULT: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
};

export function Map({ lat, lng }) {
  /**
   * @type {[Leaflet.Map, React.Dispatch<Leaflet.Map>]} state
   */
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      map.setView([lat, lng], 20);
    }
  }, [lat, lng, map]);

  return (
    <MapContainer
      className="mt-4 max-w-2xl mx-auto"
      style={{
        height: '400px',
      }}
      center={[lat, lng]}
      zoom={20}
      scrollWheelZoom
      ref={setMap}
    >
      <TileLayer url={TILES.DEFAULT} />
      <Marker
        icon={new Leaflet.Icon.Default({ iconSize: [30, 50] })}
        position={[lat, lng]}
        eventHandlers={{
          click: () => {
            window.open(
              `https://www.google.com/maps/?q=${lat},${lng}&ll=${lat},${lng}&z=20`
            );
          },
        }}
      ></Marker>
    </MapContainer>
  );
}
