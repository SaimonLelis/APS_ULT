const container = document.querySelector('.container1');
const registrarBtn_tela = document.querySelector('.registrar-btn');
const logarBtn_tela = document.querySelector('.logar-btn');
const submit = document.querySelector('button')
const erropass = document.querySelector('.alert-pass');

registrarBtn_tela.addEventListener('click', () => {
    container.classList.add('active');
});

logarBtn_tela.addEventListener('click', () => {
    container.classList.remove('active');

});

function wrongpass() {                                                                         //Conferir Senha
    const senha = document.getElementById("passreg").value;
    const csenha = document.getElementById("cpassreg").value; 
    
    if (senha.length < 6) {
        erropass.classList.add('ativo');
        erropass.innerText = "Senhas muito curtas!";
        return false;
    }

    if (senha != csenha){
        erropass.innerText = "Senhas não conferem!";
        erropass.classList.add('ativo');
        return false;        
    }
    if (senha == csenha){
        return true
    }
}


function login(event) {                                                                             //Login
    showloading();
    event.preventDefault();

    const user = document.getElementById("emaillog").value;
    const pass = document.getElementById("userpass").value;

    firebase.auth().signInWithEmailAndPassword(user, pass).then(response => {
        hideloading();
        window.location.href = "../index.html";
    }).catch(error => {
        hideloading();
        alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {                                                                  //Mensagme de Erro
    if (error.code == "auth/user-not-found" || error.code == 'auth/invalid-credential') {
        return "Usuário Não encontrado e/ou incorretos!";
    }
}

function recuperaSenha(){                                                                           //Recuperar Senha
    showloading();
    
    const email = document.getElementById("emaillog").value;
    firebase.auth().sendPasswordResetEmail(email).then(() => {
        hideloading();
        alert('Se possui uma conta com este Email verifique a caixa de entrada!');
    }).catch(error => {
        hideloading();
        alert(getErrorMessage(error));
    });
}

function registrar(event) {                                                                        //Registrar
    event.preventDefault();
    const valid = wrongpass();
    const user = document.getElementById("emailreg").value;
    const pass = document.getElementById("passreg").value;
    
    if (valid == true){
        showloading();
        firebase.auth().createUserWithEmailAndPassword(user, pass).then(() => {
            hideloading();
            window.location.href = "../Reportar/reportar.html";
        }).catch(error =>{
            hideloading();
            alert(getErrorMessage(error));
            console.log(error)
        });
    }
}