const subMenu = document.querySelector('.sub-menu-wrap');
const userlogo = document.querySelector('.useri')

function toggleMenu() {
    subMenu.classList.toggle("open-menu");
}

function logout(event) {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "../LOGIN/login.html"; // redireciona pro login
        })
        .catch((error) => {
            console.error("Erro ao deslogar:", error);
            alert("Erro ao deslogar. Tente novamente.");
        });
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        userlogo.classList.toggle("loged");
    } else {
        window.location.href = "../Login/login.html"; // Redireciona
    }
});

// Inicializa o mapa (exemplo em São Paulo)
const map = L.map('map').setView([-23.5505, -46.6333], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Variáveis globais de coordenadas
let selectedMarker = null;
let selectedLat = null;
let selectedLng = null;

map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    if (selectedMarker) {
        map.removeLayer(selectedMarker);
    }
    selectedMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍Local da Ocorrência")
        .openPopup();

    selectedLat = lat;
    selectedLng = lng;


    document.getElementById("localizacao").value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
});

const reportForm = document.getElementById("report-form");


//Quando o usuário enviar o formulário
reportForm.addEventListener("submit", function (e) {
    e.preventDefault();
    //capturar o formulário
    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value;
    const localizacao = document.getElementById("localizacao").value;

    //Pega o usuário logado
    const user = firebase.auth().currentUser;
    const email = user ? user.email : "anônimo";

    // Monta o objeto da denúncia
    const denuncia = {
        tipo,
        descricao,
        localizacao,
        latitude: selectedLat,
        longitude: selectedLng,
        emailUsuario: user.email,
        dataEnvio: new Date().toISOString(),
        aprovado: true  // ✅ Por padrão aprovado
    };

    // Push no banco
    firebase.database().ref("denuncias").push(denuncia)
    .then(() => {
        alert("🚀 Denúncia enviada com sucesso!");
        reportForm.reset();
        if (selectedMarker) map.removeLayer(selectedMarker);
        selectedMarker = null;
    })
    .catch(error => {
        console.error("Erro ao enviar denúncia:", error);
        alert("Erro ao enviar. Tente novamente.");
    });
});

//mostra denuncias
const denunciasRef = firebase.database().ref("denuncias");

// Att real time
denunciasRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    
    if (window.markers) {
        window.markers.forEach(m => map.removeLayer(m));
    }
    window.markers = [];

    // Itera pelas denúncias
    Object.keys(data).forEach(key => {
        const d = data[key];
        // Apenas mostra denúncias aprovadas
        if (d.aprovado) {
            const marker = L.marker([d.latitude, d.longitude])
                .addTo(map)
                .bindPopup(`
                    <b>${d.tipo}</b><br>
                    ${d.descricao}<br>
                    Enviado por: ${d.emailUsuario}
                `);
            window.markers.push(marker);
        }
    });
});