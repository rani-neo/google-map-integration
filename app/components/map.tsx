import { useEffect } from 'react';
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

function GoogleMap({ lat, lng }: { lat: number, lng: number }) {
  useEffect(function () {
    loadGoogleMapsScript(function () {
      var coordinates = { lat: lat, lng: lng };
      console.log("Coordinates:", coordinates);
      if (typeof google !== 'undefined') {
        const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: coordinates,
          zoom: 15,
        });

        new google.maps.Marker({
          position: coordinates,
          map
        });

        // new google.maps.marker.AdvancedMarkerElement({
        //   map,
        //   position: coordinates,
        // });
      }
    });
  }, [lat, lng]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
}

export default GoogleMap;