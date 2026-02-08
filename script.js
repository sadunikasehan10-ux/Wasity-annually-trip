import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
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

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/* User info */
let userEmail = "";
let userId = "";
let providerName = "";
let providerUid = "";

/* 🔐 Google Login */
async function googleLogin(){
  const result = await signInWithPopup(auth, googleProvider);
  setUser(result.user);
}

/* 🔐 Facebook Login */
async function facebookLogin(){
  const result = await signInWithPopup(auth, facebookProvider);
  setUser(result.user);
}

/* Save logged user */
function setUser(user){
  userEmail = user.email;
  userId = user.uid;

  const p = user.providerData[0];
  providerName = p.providerId; // google.com / facebook.com
  providerUid = p.uid;         // provider user id
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

/* Custom vote toggle (UNCHANGED) */
window.checkCustom = function(){
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* 🚀 Submit vote */
window.submitVote = async function(){

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  /* 🔐 Ensure login (no UI change) */
  if(!userId){
    const useGoogle = confirm(
      "OK = Google Login\nCancel = Facebook Login"
    );
    if(useGoogle){
      await googleLogin();
    }else{
      await facebookLogin();
    }
  }

  const name = document.getElementById("name").value.trim();
  if(name === ""){
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  const ip = await getIP();
  const dbRef = ref(db);

  const snapshot = await get(child(dbRef,"votes"));
  let voted = false;

  snapshot?.forEach(snap=>{
    const v = snap.val();

    if(
      v.userId === userId ||          // Firebase UID
      v.providerUid === providerUid ||// Google/Facebook ID
      v.email === userEmail ||        // Email
      v.ip === ip                     // IP backup
    ){
      voted = true;
    }
  });

  if(voted){
    alert("ඔබ දැනටමත් vote කරලා තියෙනවා ❌");
    btn.disabled = false;
    return;
  }

  /* 💾 Save vote (HTML fields untouched) */
  push(ref(db,"votes"),{
    name: name,
    email: userEmail,
    userId: userId,
    provider: providerName,
    providerUid: providerUid,

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
};
