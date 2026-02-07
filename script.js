import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

function getDeviceInfo(){
    return navigator.userAgent;
}

async function getIP(){
    let res = await fetch("https://api.ipify.org?format=json");
    let data = await res.json();
    return data.ip;
}

window.checkCustom = function(){
    const vote = document.getElementById("vote").value;
    document.getElementById("customVote").style.display =
        vote === "custom" ? "block" : "none";
}

window.submitVote = async function(){

    const btn = document.getElementById("submitBtn");
    btn.disabled = true;

    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;

    if(!email || !name){
        alert("නම සහ Email අවශ්‍යයි");
        btn.disabled = false;
        return;
    }

    try{
        await signInWithEmailAndPassword(auth, email, "wasity123");
    }catch{
        await createUserWithEmailAndPassword(auth, email, "wasity123");
    }

    const ip = await getIP();
    const dbRef = ref(db);

    get(child(dbRef,"votes")).then(snapshot=>{
        let voted = false;
        snapshot?.forEach(s=>{
            if(s.val().ip === ip) voted = true;
        });

        if(voted){
            alert("ඔබ දැනටමත් vote කරලා!");
            return;
        }

        saveVote(ip);
    });

    function saveVote(ip){
        push(ref(db,"votes"),{
            name,
            email,
            vote: document.getElementById("vote").value,
            customVote: document.getElementById("customVote").value,
            location: document.getElementById("location").value,
            travelTime: document.getElementById("travelTime").value,
            arrivalTime: document.getElementById("arrivalTime").value,
            parentPermission: document.getElementById("parentPermission").value,
            tripFrom: document.getElementById("tripFrom").value,
            tripTo: document.getElementById("tripTo").value,
            notAvailable: document.getElementById("notAvailable").value,
            ip,
            device: getDeviceInfo(),
            time: new Date().toLocaleString()
        });

        document.getElementById("status").innerText = "Vote saved successfully!";
    }
}
