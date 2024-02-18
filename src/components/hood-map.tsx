"use client";

import { useEffect } from "react";
import Map from "react-map-gl";

export function HoodMap() {
  return (
    <div className="w-[100vw] h-[100vh]">
      <Map
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          latitude: -8.635769422572857,
          longitude: 115.13914782040987,
          zoom: 15,
        }}
        maxZoom={20}
        minZoom={3}
      />
    </div>
  );
}
