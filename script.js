import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged
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

/* 🔐 User state */
let userEmail = "";
let userId = "";
let providerName = "";
let providerUid = "";

/* ✅ Listen auth state (IMPORTANT PART) */
onAuthStateChanged(auth, (user) => {
  if(user){
    userId = user.uid;
    userEmail = user.email;

    const p = user.providerData[0];
    providerName = p.providerId;
    providerUid = p.uid;
  }
});

/* Login functions */
async function googleLogin(){
  await signInWithPopup(auth, googleProvider);
}

async function facebookLogin(){
  await signInWithPopup(auth, facebookProvider);
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

/* Custom vote toggle (unchanged) */
window.checkCustom = function(){
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* 🚀 Submit vote */
window.submitVote = async function(){

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  /* 🔐 Force login */
  if(!userId){
    const g = confirm("OK = Google Login\nCancel = Facebook Login");
    if(g){
      await googleLogin();
    }else{
      await facebookLogin();
    }

    alert("Login complete. Submit again.");
    btn.disabled = false;
    return;
  }

  const name = document.getElementById("name").value.trim();
  if(name === ""){
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  const ip = await getIP();
  const snapshot = await get(child(ref(db),"votes"));

  let voted = false;
  snapshot?.forEach(snap=>{
    const v = snap.val();
    if(
      v.userId === userId ||
      v.providerUid === providerUid ||
      v.email === userEmail ||
      v.ip === ip
    ){
      voted = true;
    }
  });

  if(voted){
    alert("ඔබ දැනටමත් vote කරලා ❌");
    btn.disabled = false;
    return;
  }

  /* 💾 SAVE (NOW 100% FILLED) */
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
};      v.email === userEmail ||
      v.ip === ip
    ){
      voted = true;
    }
  });

  if(voted){
    alert("ඔබ දැනටමත් vote කරලා ❌");
    btn.disabled = false;
    return;
  }

  /* 💾 SAVE (NOW 100% FILLED) */
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
};    notAvailable: notAvailable.value,
    ip,
    device: getDeviceInfo(),
    time: new Date().toISOString()
  });

  document.getElementById("status").innerText =
    "✅ Vote saved successfully!";
};
