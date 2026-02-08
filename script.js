// 🔥 Firebase Config
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT"
});

const auth = firebase.auth();
const db = firebase.database();

// 🔑 Admin emails
const adminEmails = [
  "admin@gmail.com"
];

// 🌐 Get IP
async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// 🔐 Google Login
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(res => {
    const email = res.user.email;

    if (adminEmails.includes(email)) {
      window.location.href = "admin.html";
    } else {
      document.getElementById("status").innerText =
        "Logged in: " + email;
    }
  }).catch(err => {
    alert(err.message);
  });
}

// 🗳 Submit Vote
async function submitVote() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first");
    return;
  }

  const name = document.getElementById("name").value;
  const vote = document.getElementById("vote").value;
  const ip = await getIP();

  const uid = user.uid;

  // ❌ Block double vote
  const snap = await db.ref("votes/" + uid).once("value");
  if (snap.exists()) {
    alert("You already voted!");
    window.location.href = "user-results.html";
    return;
  }

  db.ref("votes/" + uid).set({
    name,
    vote,
    email: user.email,
    ip,
    time: Date.now()
  }).then(() => {
    window.location.href = "user-results.html";
  });
}
