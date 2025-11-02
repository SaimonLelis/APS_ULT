const pontos = [];      
window.markers = [];   
window.circulos = [];   


function dist(lat1, lng1, lat2, lng2) {
    const R = 6371; // raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1 * Math.PI/180) *
              Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}


function verifClusters(pontos) {
    const raioKm = 0.2;
    const circulos = [];

    for (let i = 0; i < pontos.length; i++) {
        let count = 1;
        const centro = pontos[i];

        for (let j = 0; j < pontos.length; j++) {
            if (i === j) continue;
            const p = pontos[j];
            if (dist(centro.lat, centro.lng, p.lat, p.lng) <= raioKm) {
                count++;
            }
        }

        if (count >= 3) {
            if (!circulos.some(c => dist(c.lat, c.lng, centro.lat, centro.lng) <= raioKm)) {
                circulos.push(centro);
            }
        }
    }
    return circulos;
}

function atualizaClusters(pontos) {
    if (window.circulos) {
        window.circulos.forEach(c => map.removeLayer(c));
    }
    window.circulos = [];

    const clusters = verifClusters(pontos);

    clusters.forEach(c => {
        const circle = L.circle([c.lat, c.lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3,
            radius: 500 // metros
        }).addTo(map);
        window.circulos.push(circle);
    });
}


denunciasRef.on("child_added", snapshot => {
    const d = snapshot.val();
    if (d.aprovado) {
        const marker = L.marker([d.latitude, d.longitude])
            .addTo(map)
            .bindPopup(`
                <b>${d.tipo}</b><br>
                ${d.descricao}<br>
                Enviado por: ${d.emailUsuario}
            `);
        window.markers.push(marker);

        pontos.push({lat: d.latitude, lng: d.longitude});

        atualizaClusters(pontos);
    }
});
