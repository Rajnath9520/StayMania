
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    projection: 'globe',
    zoom: 9,
    center: listing.geometry.coordinates,
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.on('style.load', () => {
    map.setFog({});
});

console.log(listing.geometry.coordinates);

const marker1 = new mapboxgl.Marker({color: 'red'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h4> ${listing.title} </h4><p> Exact Location will be provided after booking</p>`)
        )
    .addTo(map);


