'use client';

import React, { useEffect, useState } from 'react';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

function loadGoogleMapsScript(callback: () => void) {
  if (typeof window !== 'undefined' && !window.google) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = callback;
    script.onerror = () => {
      console.error('Failed to load Google Maps script.');
    };
    document.body.appendChild(script);
  } else if (typeof window !== 'undefined' && window.google) {
    callback(); // If the script is already loaded, call the callback immediately
  }
}

function GoogleMap({
  initialLat,
  initialLng,
  setCurrentLocation,
}: {
  initialLat: number;
  initialLng: number;
  setCurrentLocation: (location: { lat: number; lng: number }) => void;
}) {
  const [currentLocation, setCurrentMapLocation] = useState({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (typeof google !== 'undefined' && google.maps) {
        const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: currentLocation,
          zoom: 15,
        });

        // Add marker for the initial position
        let marker = new google.maps.Marker({
          position: currentLocation,
          map,
        });

        // If the user grants permission for their current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;

              // Update both the internal map location and the passed-in location handler
              setCurrentMapLocation({ lat: userLat, lng: userLng });
              setCurrentLocation({ lat: userLat, lng: userLng });

              // Recenter the map and place a new marker at the user's location
              map.setCenter({ lat: userLat, lng: userLng });
              marker.setPosition({ lat: userLat, lng: userLng });
            },
            (error) => {
              console.error('Error fetching location', error);
            }
          );
        }
      } else {
        console.error('Google Maps failed to load.');
      }
    });
  }, [currentLocation, setCurrentLocation]); // Re-render the map when the location changes

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
}

export default GoogleMap;
