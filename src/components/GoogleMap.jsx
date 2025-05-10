import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GoogleMap = ({ 
  apiKey, 
  companyLocations = [], 
  onMarkerClick,
  height = '500px' 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [error, setError] = useState(null);

  // Load the Google Maps script
  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key is required");
      return;
    }

    // Skip if already loaded
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const callbackName = 'initMap';
    window[callbackName] = () => {
      setMapLoaded(true);
    };

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError("Failed to load Google Maps. Please check your API key and try again.");
    };

    document.head.appendChild(script);

    return () => {
      // Clean up
      window[callbackName] = undefined;
      document.head.removeChild(script);
    };
  }, [apiKey]);

  // Initialize the map once the script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 6.3667, lng: 10.6167 }, // Centered on Bamenda, Cameroon
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMapInstance(map);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize Google Maps. Please refresh and try again.");
    }
  }, [mapLoaded, mapInstance]);

  // Add markers to the map when company locations change
  useEffect(() => {
    if (!mapInstance || !companyLocations.length) return;

    // Clear previous markers (if any)
    mapInstance.markers?.forEach((marker) => marker.setMap(null));
    
    const markers = [];
    const bounds = new window.google.maps.LatLngBounds();
    
    companyLocations.forEach((company) => {
      const position = { lat: company.lat, lng: company.lng };
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstance,
        title: company.name,
        animation: window.google.maps.Animation.DROP,
      });
      
      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px; font-weight: bold;">${company.name}</h3>
            ${company.industry ? `<p style="margin: 0;">${company.industry}</p>` : ''}
            <button id="view-${company.id}" style="margin-top: 8px; padding: 4px 8px; background: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer;">
              View Details
            </button>
          </div>
        `,
      });
      
      // Add click event
      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
        
        // We need to wait for the DOM to be updated with our content
        setTimeout(() => {
          const button = document.getElementById(`view-${company.id}`);
          if (button && onMarkerClick) {
            button.addEventListener('click', () => {
              onMarkerClick(company);
              infoWindow.close();
            });
          }
        }, 10);
      });
      
      markers.push(marker);
      bounds.extend(position);
    });
    
    // Store markers on the map instance for later cleanup
    mapInstance.markers = markers;
    
    // Fit map to bounds if we have multiple markers
    if (markers.length > 1) {
      mapInstance.fitBounds(bounds);
    } else if (markers.length === 1) {
      mapInstance.setCenter(markers[0].getPosition());
      mapInstance.setZoom(15);
    }
  }, [mapInstance, companyLocations, onMarkerClick]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Map Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()} 
            className="mt-2 ml-auto"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      {!mapLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ display: mapLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export default GoogleMap;