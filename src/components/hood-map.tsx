"use client";

import { useEffect } from "react";
import Map from "react-map-gl";

export function HoodMap() {
  return (
    <div className="w-[100vh] h-[100vh]">
      <Map
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          latitude: 35.668641,
          longitude: 139.750567,
          zoom: 15,
        }}
        maxZoom={20}
        minZoom={3}
      />
    </div>
  );
}
