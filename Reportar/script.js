const subMenu = document.querySelector('.sub-menu-wrap');
const userlogo = document.querySelector('.useri');

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

const map = L.map('map').setView([-23.5505, -46.6333], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let selectedMarker = null;
let selectedLat = null;
let selectedLng = null;

map.on('click', (e) => {
    const { lat, lng } = e.latlng;

    if (selectedMarker) map.removeLayer(selectedMarker);

    selectedMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 Local da Ocorrência")
        .openPopup();

    selectedLat = lat;
    selectedLng = lng;

    document.getElementById("localizacao").value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
});

//block enter
document.getElementById("report-form").addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.preventDefault();
});

//                                                          Form
const reportForm = document.getElementById("report-form");

//Quando o usuário enviar o formulário

reportForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value;
    const localizacao = document.getElementById("localizacao").value;

    const user = firebase.auth().currentUser;

    if (!selectedMarker || !selectedLat || !selectedLng) {
        alert("Selecione um local no mapa! ou digite um endereço válido.");
        return;
    }
    
    const denuncia = {
        tipo,
        descricao,
        localizacao,
        latitude: selectedLat,
        longitude: selectedLng,
        emailUsuario: user.email,
        dataEnvio: new Date().toISOString(),
        aprovado: true  
    };

    // Push no banco
    firebase.database().ref("denuncias").push(denuncia)
        .then(() => {
            alert("🎉 Denúncia enviada com sucesso!");
            reportForm.reset();
            if (selectedMarker) map.removeLayer(selectedMarker);
            selectedMarker = null;
        })
        .catch(error => {
            alert("Erro ao enviar. Tente novamente.", error);
        });
});

denunciasRef = firebase.database().ref("denuncias");

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

const inputLocalizacao = document.getElementById("localizacao");
const sugestoesContainer = document.getElementById("sugestoes");
let timeoutBusca = null;

// Busca com Nominatim
async function buscarSugestoes(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
  try {
    const resposta = await fetch(url);
    return await resposta.json();
  } catch (erro) {
    console.error("Erro ao buscar sugestões:", erro);
    return [];
  }
}

// Exibe sugestões
function mostrarSugestoes(lista) {
  sugestoesContainer.innerHTML = "";
  if (lista.length === 0) {
    sugestoesContainer.style.display = "none";
    return;
  }

  lista.forEach(item => {
    const enderecoCurto = `${item.address.road || ""}, ${item.address.suburb || ""}, ${item.address.city || ""}`;
    const opcao = document.createElement("div");
    opcao.textContent = enderecoCurto || item.display_name;

    opcao.addEventListener("click", () => {
      inputLocalizacao.value = item.display_name;
      sugestoesContainer.style.display = "none";

      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      map.setView([lat, lon], 16);

      if (selectedMarker) map.removeLayer(selectedMarker);
      selectedMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup("📍 Selecione no mapa")
        .openPopup();

      selectedLat = lat;
      selectedLng = lon;
    });

    sugestoesContainer.appendChild(opcao);
  });

  sugestoesContainer.style.display = "block";
}

// Escuta digitação
inputLocalizacao.addEventListener("input", () => {
  const query = inputLocalizacao.value.trim();
  clearTimeout(timeoutBusca);
  if (query.length < 3) {
    sugestoesContainer.style.display = "none";
    return;
  }

  timeoutBusca = setTimeout(async () => {
    const resultados = await buscarSugestoes(query);
    mostrarSugestoes(resultados);
  }, 400);
});

// Quando o usuário pressiona Enter após digitar o endereço
inputLocalizacao.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = inputLocalizacao.value.trim();
    if (query.length < 3) return;

    const resultados = await buscarSugestoes(query);
    sugestoesContainer.style.display = "none";

    if (resultados.length > 0) {
      const item = resultados[0];
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      map.setView([lat, lon], 16);

      if (selectedMarker) map.removeLayer(selectedMarker);
      selectedMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup("📍 Selecione no mapa")
        .openPopup();

      selectedLat = lat;
      selectedLng = lon;
    }
  }
});

// Fecha sugestões ao clicar fora
document.addEventListener("click", (e) => {
  if (!sugestoesContainer.contains(e.target) && e.target !== inputLocalizacao) {
    sugestoesContainer.style.display = "none";
  }
});
