import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* Firebase config */
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

/* Current user */
let currentUser = null;

/* Auth state listener */
onAuthStateChanged(auth, user => {
  currentUser = user;
});

/* Custom vote toggle (used by HTML) */
window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* Bind submit button AFTER page loads */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  if (btn) {
    btn.addEventListener("click", submitVote);
  }
});

/* Main submit function */
async function submitVote() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  try {
    /* Login with Google if not logged */
    if (!currentUser) {
      const result = await signInWithPopup(auth, provider);
      currentUser = result.user;
    }

    const name = document.getElementById("name").value.trim();
    if (!name) {
      alert("නම ඇතුලත් කරන්න");
      btn.disabled = false;
      return;
    }

    /* Check duplicate vote by UID */
    const snap = await get(ref(db, "votes"));
    let alreadyVoted = false;

    snap.forEach(s => {
      if (s.val().userId === currentUser.uid) {
        alreadyVoted = true;
      }
    });

    if (alreadyVoted) {
      alert("ඔබ දැනටමත් vote කරලා!");
      window.location.href = "results.html";
      return;
    }

    /* Save vote */
    await push(ref(db, "votes"), {
      name: name,
      email: currentUser.email,
      userId: currentUser.uid,
      vote: document.getElementById("vote").value,
      customVote: document.getElementById("customVote").value,
      location: document.getElementById("location").value,
      travelTime: document.getElementById("travelTime").value,
      arrivalTime: document.getElementById("arrivalTime").value,
      parentPermission: document.getElementById("parentPermission").value,
      tripFrom: document.getElementById("tripFrom").value,
      tripTo: document.getElementById("tripTo").value,
      notAvailable: document.getElementById("notAvailable").value,
      time: new Date().toLocaleString()
    });

    document.getElementById("status").innerText =
      "Vote saved successfully!";

    setTimeout(() => {
      window.location.href = "results.html";
    }, 1000);

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
    btn.disabled = false;
  }
}
