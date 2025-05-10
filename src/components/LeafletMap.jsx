import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Custom marker icon setup
const createCustomIcon = (color = "#3B82F6") => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const LeafletMap = ({
  companyLocations = [],
  onMarkerClick,
  height = "400px",
  width = "100%",
  defaultCenter = [5.9597, 10.1667], // Bamenda, Cameroon
  defaultZoom = 12,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map and set bounds to include all markers
  useEffect(() => {
    if (map && companyLocations.length > 0) {
      const bounds = L.latLngBounds(
        companyLocations.map((company) => [company.lat, company.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, companyLocations]);

  const handleMarkerClick = (company) => {
    if (onMarkerClick) {
      onMarkerClick(company);
    }
  };

  return (
    <div style={{ height, width }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        ref={mapRef}
        whenReady={(map) => setMap(map.target)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {companyLocations.map((company) => (
          <Marker
            key={company.id}
            position={[company.lat, company.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(company),
            }}
            icon={createCustomIcon()}
          >
            <Popup>
              <div>
                <h4 className="font-medium">{company.name}</h4>
                <p className="text-sm text-gray-600">{company.industry || "Company"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;