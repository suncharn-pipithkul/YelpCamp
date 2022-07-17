mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});

// Create a default Marker and add it to the map.
const popup1 = new mapboxgl.Popup({ offset: 25 })
                          .setHTML(`
                            <h3>${campground.title}</h3>
                            <p>${campground.location}</p>
                          `);

const marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(popup1)
.addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');


map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
});