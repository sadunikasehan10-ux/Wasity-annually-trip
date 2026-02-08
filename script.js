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

/* ================= AUTH ================= */

window.loginGoogle = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    userEmail = result.user.email;
    userId = result.user.uid;
  } catch (err) {
    alert("Google login failed");
    console.error(err);
  }
};

window.loginFacebook = function () {
  alert("Facebook login not implemented");
};

/* ================= HELPERS ================= */

async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

function getDeviceInfo() {
  return navigator.userAgent;
}

window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* ================= SUBMIT VOTE ================= */

window.submitVote = async function () {

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  /* Ensure login */
  if (!userEmail) {
    await loginGoogle();
    if (!userEmail) {
      btn.disabled = false;
      return;
    }
  }

  /* Validate name */
  const name = document.getElementById("name").value.trim();
  if (name === "") {
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  /* Get IP */
  let ip = "unknown";
  try {
    ip = await getIP();
  } catch (e) {
    console.warn("IP fetch failed");
  }

  /* Check duplicates */
  const snapshot = await get(child(ref(db), "votes"));
  let voted = false;

  if (snapshot.exists()) {
    snapshot.forEach(snap => {
      const v = snap.val();
      if (
        v.userId === userId ||
        v.email === userEmail ||
        v.ip === ip
      ) {
        voted = true;
      }
    });
  }

  /* If already voted → redirect */
  if (voted) {
    window.location.href = "results.html";
    return;
  }

  /* Save vote */
  await push(ref(db, "votes"), {
    name: name,
    email: userEmail,
    userId: userId,
    vote: document.getElementById("vote").value,
    customVote: document.getElementById("customVote").value,
    location: document.getElementById("location")?.value || "",
    ip: ip,
    device: getDeviceInfo(),
    time: new Date().toLocaleString()
  });

  /* Redirect to results */
  window.location.href = "results.html";
};
