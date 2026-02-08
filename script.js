import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
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

/* Providers */
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/* User state */
let userId = "";
let userEmail = "";
let providerName = "";
let providerUid = "";

/* 🔐 Auth state listener (MOST IMPORTANT) */
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    userEmail = user.email || "";

    const p = user.providerData[0];
    providerName = p?.providerId || "";
    providerUid = p?.uid || "";
  }
});

/* Handle redirect result (required for GitHub Pages) */
getRedirectResult(auth).catch((error) => {
  console.error("Auth redirect error:", error.code, error.message);
});

/* 🔐 Login functions (redirect – popup safe) */
async function googleLogin() {
  await signInWithRedirect(auth, googleProvider);
}

async function facebookLogin() {
  await signInWithRedirect(auth, facebookProvider);
}

/* Device info */
function getDeviceInfo() {
  return navigator.userAgent;
}

/* Get IP address */
async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

/* Custom vote toggle (UNCHANGED) */
window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* 🚀 Submit vote */
window.submitVote = async function () {

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  /* 🔐 Force login first */
  if (!userId) {
    const useGoogle = confirm(
      "OK = Google Login\nCancel = Facebook Login"
    );

    if (useGoogle) {
      await googleLogin();
    } else {
      await facebookLogin();
    }

    alert("Login complete වුණාට පස්සේ Submit button එක ආයෙම click කරන්න");
    btn.disabled = false;
    return;
  }

  const name = document.getElementById("name").value.trim();
  if (name === "") {
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  const ip = await getIP();
  const snapshot = await get(child(ref(db), "votes"));

  let voted = false;
  snapshot?.forEach(snap => {
    const v = snap.val();
    if (
      v.userId === userId ||          // Firebase UID
      v.providerUid === providerUid ||// Google / Facebook ID
      v.email === userEmail ||        // Email
      v.ip === ip                     // IP backup
    ) {
      voted = true;
    }
  });

  if (voted) {
    alert("ඔබ දැනටමත් vote කරලා තියෙනවා ❌");
    btn.disabled = false;
    return;
  }

  /* 💾 Save vote */
  push(ref(db, "votes"), {
    name: name,

    /* 🔐 Auth info */
    email: userEmail,
    userId: userId,
    provider: providerName,
    providerUid: providerUid,

    /* 🗳️ Vote data */
    vote: document.getElementById("vote").value,
    customVote: document.getElementById("customVote").value,
    location: document.getElementById("location").value,
    travelTime: document.getElementById("travelTime").value,
    arrivalTime: document.getElementById("arrivalTime").value,
    parentPermission: document.getElementById("parentPermission").value,
    tripFrom: document.getElementById("tripFrom").value,
    tripTo: document.getElementById("tripTo").value,
    notAvailable: document.getElementById("notAvailable").value,

    /* 🌍 Meta */
    ip: ip,
    device: getDeviceInfo(),
    time: new Date().toISOString()
  });

  document.getElementById("status").innerText =
    "✅ Vote saved successfully!";
};  const ip = await getIP();
  const snapshot = await get(child(ref(db), "votes"));

  let voted = false;
  snapshot?.forEach(snap => {
    const v = snap.val();
    if (
      v.userId === userId ||
      v.providerUid === providerUid ||
      v.email === userEmail ||
      v.ip === ip
    ) {
      voted = true;
    }
  });

  if (voted) {
    alert("ඔබ දැනටමත් vote කරලා තියෙනවා ❌");
    btn.disabled = false;
    return;
  }

  /* 💾 Save vote */
  push(ref(db, "votes"), {
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
    time: new Date().toISOString()
  });

  document.getElementById("status").innerText =
    "✅ Vote saved successfully!";
};      v.providerUid === providerUid ||
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
