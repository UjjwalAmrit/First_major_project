
	var map = L.map('map').setView([listing.geometry.coordinates[1], listing.geometry.coordinates[0]], 10);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);



	L.marker([listing.geometry.coordinates[1], listing.geometry.coordinates[0]]).addTo(map)
    .addTo(map)
	.bindPopup(`<h4><b>${listing.title}</b></h4><br>Exact Location will be provided after booking.`);