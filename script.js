const denunciasRef = firebase.database().ref("denuncias");

const map = L.map('map').setView([-23.5505, -46.6333], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
