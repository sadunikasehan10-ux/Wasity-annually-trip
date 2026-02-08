import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let userEmail = "";
let userId = "";

async function googleLogin() {
  const result = await signInWithPopup(auth, provider);
  userEmail = result.user.email;
  userId = result.user.uid;
}

window.checkCustom = function () {
  const vote = document.getElementById("vote").value;
  document.getElementById("customVote").style.display =
    vote === "custom" ? "block" : "none";
};

window.submitVote = async function () {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  if (!userEmail) await googleLogin();

  const name = document.getElementById("name").value.trim();
  if (!name) {
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  const snapshot = await get(ref(db, "votes"));
  let already = false;

  snapshot.forEach(snap => {
    if (snap.val().userId === userId) already = true;
  });

  if (already) {
    alert("ඔබ දැනටමත් vote කරලා!");
    window.location.href = "results.html";
    return;
  }

  await push(ref(db, "votes"), {
    name,
    email: userEmail,
    userId,
    vote: document.getElementById("vote").value,
    customVote: document.getElementById("customVote").value,
    time: new Date().toLocaleString()
  });

  document.getElementById("status").innerText = "Vote saved!";
  setTimeout(() => window.location.href = "results.html", 1000);
};  document.getElementById("status").innerText =
    "✅ Vote saved successfully";
};
