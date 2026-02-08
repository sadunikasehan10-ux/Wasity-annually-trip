/* ===============================
   🔥 FIREBASE IMPORTS (v10)
================================ */
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
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===============================
   🔥 FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

/* ===============================
   🔥 INIT
================================ */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* ===============================
   👤 USER STATE
================================ */
let currentUser = null;
let userIP = "";

/* ===============================
   🌍 GET IP
================================ */
async function loadIP(){
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    userIP = data.ip;
  } catch {
    userIP = "UNKNOWN";
  }
}
loadIP();

/* ===============================
   🔐 GOOGLE LOGIN (REDIRECT)
================================ */
window.loginGoogle = function () {
  signInWithRedirect(auth, provider);
};

/* ===============================
   🔁 HANDLE REDIRECT RESULT
================================ */
getRedirectResult(auth).catch(err => {
  console.error(err);
});

/* ===============================
   🔐 AUTH STATE CHANGE
================================ */
onAuthStateChanged(auth, async user => {
  if (user) {
    currentUser = user;

    document.getElementById("loginStatus").innerText =
      "Logged in as " + user.email;

    await checkAlreadyVoted();
  } else {
    document.getElementById("submitBtn").disabled = true;
  }
});

/* ===============================
   🚫 CHECK DUPLICATE VOTE
================================ */
async function checkAlreadyVoted() {
  const snapshot = await get(child(ref(db), "votes"));
  let voted = false;

  snapshot?.forEach(snap => {
    const v = snap.val();
    if (
      v.email === currentUser.email ||
      v.uid === currentUser.uid ||
      v.ip === userIP
    ) {
      voted = true;
    }
  });

  if (voted) {
    window.location.href = "results.html";
  } else {
    document.getElementById("submitBtn").disabled = false;
  }
}

/* ===============================
   👁 CUSTOM VOTE TOGGLE
================================ */
window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* ===============================
   📱 DEVICE INFO
================================ */
function getDeviceInfo() {
  return navigator.userAgent;
}

/* ===============================
   🗳️ SUBMIT VOTE
================================ */
window.submitVote = async function () {

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  if (!currentUser) {
    document.getElementById("status").innerText =
      "Please login first.";
    btn.disabled = false;
    return;
  }

  const name = document.getElementById("name").value.trim();
  if (name === "") {
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  const finalVote =
    document.getElementById("vote").value === "custom"
      ? document.getElementById("customVote").value
      : document.getElementById("vote").value;

  const voteData = {
    uid: currentUser.uid,
    email: currentUser.email,
    provider: currentUser.providerData[0].providerId,
    ip: userIP,
    device: getDeviceInfo(),
    time: new Date().toLocaleString(),

    name: name,
    vote: finalVote,
    location: document.getElementById("location").value,
    travelTime: document.getElementById("travelTime").value,
    arrivalTime: document.getElementById("arrivalTime").value,
    parentPermission: document.getElementById("parentPermission").value,
    tripFrom: document.getElementById("tripFrom").value,
    tripTo: document.getElementById("tripTo").value,
    notAvailable: document.getElementById("notAvailable").value
  };

  await push(ref(db, "votes"), voteData);

  window.location.href = "results.html";
};
