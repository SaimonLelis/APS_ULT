const container = document.querySelector('.container1');
const registrarBtn_tela = document.querySelector('.registrar-btn');
const logarBtn_tela = document.querySelector('.logar-btn');
const submit = document.querySelector('button')

registrarBtn_tela.addEventListener('click', () => {
    container.classList.add('active');
});

logarBtn_tela.addEventListener('click', () => {
    container.classList.remove('active');
    
});

 function login() {
    console.log('foi bebe');
}


function registrar(){
    console.log('também foi');
}


/*
 <script type="module">
        
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  
        const firebaseConfig = {
        apiKey: "AIzaSyDG4DhV1Tk_T8QsNoahLIkbPc4fe6Qnmgg",
        authDomain: "aps-teste-43598.firebaseapp.com",
        databaseURL: "https://aps-teste-43598-default-rtdb.firebaseio.com",
        projectId: "aps-teste-43598",
        storageBucket: "aps-teste-43598.firebasestorage.app",
        messagingSenderId: "828209031237",
        appId: "1:828209031237:web:b889489882d2ee2bcadb2c"
        };
        
        const app = initializeApp(firebaseConfig);

        import {getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

        const db = getDatabase();

        let userlog = document.getElementById("userlog");
        let passlog = document.getElementById("passlog");
        
        let userreg = document.getElementById("userreg");
        let emailreg = document.getElementById("emailreg");
        let passreg = document.getElementById("passreg");

        let btnLogar = document.getElementById("btnLogar");
        let btnReg = document.getElementById("btnReg");

        function addData(){
            set(ref(db, 'EmployeeSet/' + userlog.value))
        }
    </script>
*/
