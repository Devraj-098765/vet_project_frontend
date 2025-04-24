# Find Nearby Veterinarians Map Feature

This feature uses Leaflet.js to show veterinarians on a map based on the user's current location.

## Features

- Captures the user's current location using the browser's Geolocation API
- Geocodes veterinarian addresses to coordinates using the OpenStreetMap Nominatim API
- Displays veterinarians on the map with custom markers
- Calculates distances between the user and veterinarians using the Haversine formula
- Shows a list of nearby veterinarians (within 10km) sorted by distance
- Provides direct booking links from both the map popups and the nearby list

## Implementation Details

1. The `VetLocationMap.jsx` component handles the map display and location logic
2. We use `react-leaflet` to integrate Leaflet.js with React
3. Veterinarian locations are stored as address strings in the database and geocoded at runtime
4. Custom markers differentiate between the user's location and veterinarian locations

## Usage

Users can access this feature by clicking the "Find Nearby Vets" link in the navigation bar. The browser will request permission to access the user's location. Once granted, the map will center on the user's location and display nearby veterinarians.

## Dependencies

- leaflet
- react-leaflet
- axios (for API requests)

## Notes for Developers

- Ensure the Leaflet CSS is properly loaded (included in index.html)
- The Nominatim API has usage limitations, consider caching geocoded addresses for production use
- For improved performance, consider storing coordinates in the database instead of geocoding at runtime 