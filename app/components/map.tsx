import { useEffect } from 'react';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

function loadGoogleMapsScript(callback: () => void) {
  if (typeof window !== 'undefined' && !window.google) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  } else {
    callback();
  }
}

function GoogleMap({ lat, lng }: { lat: number, lng: number }) {
  useEffect(function () {
    loadGoogleMapsScript(function () {
      if (typeof google !== 'undefined') {
        const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: { lat, lng },
          zoom: 15,
        });

        new google.maps.Marker({
          position: { lat, lng },
          map,
        });
      }
    });
  }, [lat, lng]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
}

export default GoogleMap;
