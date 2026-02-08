import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* Firebase config */
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

/* Login */
window.loginGoogle = async function () {
  const result = await signInWithPopup(auth, provider);
  userEmail = result.user.email;
  userId = result.user.uid;
};

window.loginFacebook = function () {
  alert("Facebook login not implemented");
};

/* Custom vote */
window.checkCustom = function () {
  document.getElementById("customVote").style.display =
    document.getElementById("vote").value === "custom" ? "block" : "none";
};

/* Submit vote */
window.submitVote = async function () {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  if (!userEmail) await loginGoogle();

  const name = document.getElementById("name").value.trim();
  if (!name) {
    alert("නම ඇතුලත් කරන්න");
    btn.disabled = false;
    return;
  }

  const snapshot = await get(child(ref(db), "votes"));
  let voted = false;

  if (snapshot.exists()) {
    snapshot.forEach(s => {
      const v = s.val();
      if (v.email === userEmail || v.userId === userId) voted = true;
    });
  }

  if (voted) {
    window.location.href = "results.html";
    return;
  }

  await push(ref(db, "votes"), {
    name,
    email: userEmail,
    userId,
    vote: document.getElementById("vote").value,
    customVote: document.getElementById("customVote").value,
    location: document.getElementById("location").value,
    time: new Date().toLocaleString()
  });

  window.location.href = "results.html";
};
