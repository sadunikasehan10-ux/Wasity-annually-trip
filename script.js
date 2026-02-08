import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔥 CORRECT firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "sadunikasehan10-ux.github.io",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

/* Init */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

/* Auth listener */
onAuthStateChanged(auth, user => {
  currentUser = user;
});

/* Custom vote */
window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

/* Button binding */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  if (!btn) {
    alert("Submit button not found");
    return;
  }
  btn.addEventListener("click", submitVote);
});

/* Main logic */
async function submitVote() {
  try {
    if (!currentUser) {
      const result = await signInWithPopup(auth, provider);
      currentUser = result.user;
    }

    const name = document.getElementById("name").value.trim();
    if (!name) {
      alert("නම ඇතුලත් කරන්න");
      return;
    }

    const snap = await get(ref(db, "votes"));
    let voted = false;

    snap.forEach(s => {
      if (s.val().userId === currentUser.uid) voted = true;
    });

    if (voted) {
      alert("ඔබ දැනටමත් vote කරලා!");
      window.location.href = "results.html";
      return;
    }

    await push(ref(db, "votes"), {
      name,
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

    alert("Vote saved successfully!");
    window.location.href = "results.html";

  } catch (e) {
    console.error(e);
    alert("Login or submit failed. Check console.");
  }
}    console.error(err);
    alert("Something went wrong. Try again.");
    btn.disabled = false;
  }
}
