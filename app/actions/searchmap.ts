'use server'

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;


export interface PlacePrediction {
    placePrediction?: {
      place: string;
      placeId: string;
      text: {
        text: string;
        matches: { endOffset: number }[];
      };
      structuredFormat?: {
        mainText: {
          text: string;
          matches: { endOffset: number }[];
        };
        secondaryText: {
          text: string;
        };
      };
      types?: string[];
      distanceMeters?: number;
    };
  }
  
  interface QueryPrediction {
    queryPrediction?: {
      text: {
        text: string;
        matches: { endOffset: number }[];
      };
    };
  }
  
export  type AutocompleteResult = PlacePrediction | QueryPrediction;


  
  

export async function fetchRestaurants(location: string) {
  if (!GOOGLE_MAP_KEY) {
    throw new Error('Google Maps API key is missing');
  }

  console.log(location);
  
  const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&type=restaurant&key=${GOOGLE_MAP_KEY}`, {
    method: 'GET',
    next: { revalidate: 60 },  // Revalidate the response every 60 seconds
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data.results;
}

export async function fetchRestaurantAutocomplete(query: string, city: string, state: string, postcode: string): Promise<AutocompleteResult[]> {
    if (!GOOGLE_MAP_KEY) {
      throw new Error('Google Maps API key is missing');
    }
  
    const requestBody = {
      input: query,
      locationBias: {
        rectangle: {
          low: {
            latitude: -43.00311,  // Southernmost point of Australia
            longitude: 113.6594,  // Westernmost point of Australia
          },
          high: {
            latitude: -10.0,     // Northernmost point of Australia
            longitude: 153.61194, // Easternmost point of Australia
          }
        }
      },
      includedRegionCodes: ['au'],
    };
  
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAP_KEY,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',  // Disable caching for this request
    });
  
    if (!response.ok) {
        console.error(response);
      throw new Error(`Failed to fetch autocomplete: ${response.statusText}`);
    }
  
    const data = await response.json();
    console.log(data);
    return data.suggestions as AutocompleteResult[];
  }
  