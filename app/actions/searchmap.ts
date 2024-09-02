
const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export async function fetchRestaurants(location: string) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&type=restaurant&key=${GOOGLE_MAP_KEY}`);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.results;
  }
  