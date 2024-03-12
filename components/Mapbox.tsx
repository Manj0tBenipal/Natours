"use client";
import { useRef, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationPin } from "react-icons/fa6";

interface Marker {
  location: Location;
  index: number;
}
export default function Mapbox({ tour }: { tour: TourDetailed }) {
  //currently focused marker on the map
  const [selectedMarker, setSelectedMarker] = useState<Marker>({} as Marker);

  const mapRef = useRef<MapRef>(null);
  const zoomToSelectedLoc = (
    e: React.MouseEvent<HTMLButtonElement>,
    location: Location,
    index: number
  ) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setSelectedMarker({ location, index });
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current?.flyTo({
        center: [location.coordinates[0], location.coordinates[1]],
        zoom: 10,
      });
    }
  };

  return (
    <div className="relative h-[50vh] rounded-2xl overflow-hidden">
      <Map
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
        mapStyle={`mapbox://styles/manj0tbenipal/cltn6omk701lk01phc3umaywx`}
        initialViewState={{
          latitude: tour.startLocation.coordinates[1],
          longitude: tour.startLocation.coordinates[0],
          zoom: 10,
        }}
        maxZoom={20}
        minZoom={3}
      >
        {tour.locations.map((location: Location, index) => {
          return (
            <Marker
              key={index}
              longitude={location.coordinates[0]}
              latitude={location.coordinates[1]}
            >
              {" "}
              <button
                type="button"
                className="cursor-pointer"
                onClick={(e) => zoomToSelectedLoc(e, location, index)}
              >
                {<FaLocationPin size={30} color="var(--color-primary)" />}
              </button>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
