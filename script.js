import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

let userId = "";
let userEmail = "";
let providerName = "";
let providerUid = "";

window.googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  setUser(result.user);
};

window.facebookLogin = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
  setUser(result.user);
};

function setUser(user){
  userId = user.uid;
  userEmail = user.email;
  providerName = user.providerData[0].providerId;
  providerUid = user.providerData[0].uid;
}

function getDeviceInfo(){
  return navigator.userAgent;
}

async function getIP(){
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

window.checkCustom = () => {
  document.getElementById("customVote").style.display =
    vote.value === "custom" ? "block" : "none";
};

window.submitVote = async () => {

  if(!userId){
    alert("Login වෙන්න");
    return;
  }

  const name = document.getElementById("name").value.trim();
  if(!name){
    alert("නම ඇතුලත් කරන්න");
    return;
  }

  const ip = await getIP();
  const dbRef = ref(db);

  const snapshot = await get(child(dbRef,"votes"));
  let voted = false;

  snapshot?.forEach(snap=>{
    const v = snap.val();
    if(v.userId === userId || v.providerUid === providerUid || v.ip === ip){
      voted = true;
    }
  });

  if(voted){
    alert("ඔබ දැනටමත් vote කරලා ❌");
    return;
  }

  push(ref(db,"votes"),{
    name,
    email: userEmail,
    userId,
    provider: providerName,
    providerUid,
    vote: vote.value,
    customVote: customVote.value,
    location: location.value,
    travelTime: travelTime.value,
    arrivalTime: arrivalTime.value,
    parentPermission: parentPermission.value,
    tripFrom: tripFrom.value,
    tripTo: tripTo.value,
    notAvailable: notAvailable.value,
    ip,
    device: getDeviceInfo(),
    time: new Date().toISOString()
  });

  document.getElementById("status").innerText =
    "✅ Vote saved successfully!";
};
