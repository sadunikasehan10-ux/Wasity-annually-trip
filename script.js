// 🔥 Firebase config (PASTE YOUR REAL CONFIG)
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID"
});

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

// ✅ Google Login
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(res => {
      currentUser = res.user;
      document.getElementById("loginStatus").innerText =
        "Logged in as " + currentUser.email;
    })
    .catch(err => alert(err.message));
}

// 🌐 Get IP
async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// 🔽 Custom vote toggle
function checkCustom() {
  document.getElementById("customVote").style.display =
    vote.value === "custom" ? "block" : "none";
}

// 🗳 Submit Vote
async function submitVote() {

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const name = document.getElementById("name").value.trim();
  if (!name) {
    alert("Name required");
    return;
  }

  const ip = await getIP();
  const uid = currentUser.uid;
  const email = currentUser.email;

  const snapshot = await db.ref("votes").once("value");
  let alreadyVoted = false;

  snapshot.forEach(snap => {
    const v = snap.val();
    if (v.uid === uid || v.email === email || v.ip === ip) {
      alreadyVoted = true;
    }
  });

  if (alreadyVoted) {
    alert("You already voted!");
    return;
  }

  await db.ref("votes").push({
    uid,
    email,
    ip,
    name,
    vote: vote.value,
    customVote: customVote.value,
    time: new Date().toISOString()
  });

  // 🔀 Redirect
  const adminEmails = ["admin@gmail.com"];
  if (adminEmails.includes(email)) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "user-results.html";
  }
}
