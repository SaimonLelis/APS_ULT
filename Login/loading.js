function showloading(){
    const div = document.createElement("div");
    div.classList.add("load");
    document.body.appendChild(div);

    const label = document.createElement("label");
    label.innerText = "Carregando...";

    div.appendChild(label);

}

function hideloading(){
    const loading = document.getElementsByClassName("load");
    if (loading.length){
        loading[0].remove();
    }
}