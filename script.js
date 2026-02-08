import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔥 Firebase config */
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

/* Logged user info */
let loggedUser = null;

/* ================= LOGIN ================= */

async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  loggedUser = result.user;
}

async function loginWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  loggedUser = result.user;
}

/* ================= HELPERS ================= */

function getDeviceInfo() {
  return navigator.userAgent;
}

async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

/* Custom vote toggle */
window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* ================= SUBMIT VOTE ================= */

window.submitVote = async function () {

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  try {

    /* 🔐 Login choice */
    if (!loggedUser) {
      const choice = confirm(
        "OK = Google Login\nCancel = Facebook Login"
      );
      if (choice) {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
    }

    if (!loggedUser) {
      alert("Login failed");
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
    const dbRef = ref(db);

    /* 🔎 Check double vote */
    const snapshot = await get(child(dbRef, "votes"));
    let voted = false;

    snapshot?.forEach(snap => {
      const v = snap.val();
      if (
        v.ip === ip ||
        v.email === loggedUser.email ||
        v.uid === loggedUser.uid
      ) {
        voted = true;
      }
    });

    if (voted) {
      alert("ඔබ දැනටමත් vote කරලා!");
      btn.disabled = false;
      return;
    }

    /* 💾 Save vote */
    await push(ref(db, "votes"), {
      name: name,

      /* 🔐 AUTH INFO */
      email: loggedUser.email || null,
      uid: loggedUser.uid,
      provider: loggedUser.providerData[0]?.providerId || null,
      providerId: loggedUser.providerData[0]?.uid || null,

      /* 🗳️ VOTE DATA */
      vote: document.getElementById("vote").value,
      customVote: document.getElementById("customVote").value,
      location: document.getElementById("location").value,
      travelTime: document.getElementById("travelTime").value,
      arrivalTime: document.getElementById("arrivalTime").value,
      parentPermission: document.getElementById("parentPermission").value,
      tripFrom: document.getElementById("tripFrom").value,
      tripTo: document.getElementById("tripTo").value,
      notAvailable: document.getElementById("notAvailable").value,

      /* 🌐 META */
      ip: ip,
      device: getDeviceInfo(),
      time: new Date().toISOString()
    });

    document.getElementById("status").innerText =
      "✅ Vote saved successfully!";

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }

  btn.disabled = false;
};    return;
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
