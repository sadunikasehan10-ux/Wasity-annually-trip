import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔥 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

/* Init */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* User info */
let userEmail = "";
let userId = "";

/* Google Login */
async function googleLogin(){
    const result = await signInWithPopup(auth, provider);
    userEmail = result.user.email;
    userId = result.user.uid;
}

/* Device */
function getDeviceInfo(){
    return navigator.userAgent;
}

/* IP */
async function getIP(){
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
}

/* Custom vote toggle */
window.checkCustom = function(){
    const vote = document.getElementById("vote").value;
    document.getElementById("customVote").style.display =
        vote === "custom" ? "block" : "none";
};

/* Submit vote */
window.submitVote = async function(){

    const btn = document.getElementById("submitBtn");
    btn.disabled = true;

    /* Ensure login */
    if(!userEmail){
        await googleLogin();
    }

    const name = document.getElementById("name").value.trim();
    if(name === ""){
        alert("නම ඇතුලත් කරන්න");
        btn.disabled = false;
        return;
    }

    const ip = await getIP();
    const dbRef = ref(db);

    get(child(dbRef,"votes")).then(snapshot=>{

        let voted = false;

        snapshot?.forEach(snap=>{
            const v = snap.val();
            if(v.ip === ip || v.email === userEmail){
                voted = true;
            }
        });

        if(voted){
            alert("ඔබ දැනටමත් vote කරලා!");
            return;
        }

        saveVote(ip);
    });

    function saveVote(ip){
        push(ref(db,"votes"),{
            name: name,
            email: userEmail,      // ✅ REAL EMAIL
            userId: userId,
            vote: document.getElementById("vote").value,
            customVote: document.getElementById("customVote").value,
            location: document.getElementById("location").value,
            travelTime: document.getElementById("travelTime").value,
            arrivalTime: document.getElementById("arrivalTime").value,
            parentPermission: document.getElementById("parentPermission").value,
            tripFrom: document.getElementById("tripFrom").value,
            tripTo: document.getElementById("tripTo").value,
            notAvailable: document.getElementById("notAvailable").value,
            ip: ip,
            device: getDeviceInfo(),
            time: new Date().toLocaleString()
        });

        document.getElementById("status").innerText =
            "Vote saved successfully!";
    }
};

