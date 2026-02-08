// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let userIP = null;

// 🌍 Get IP
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => userIP = data.ip);

// 🔐 Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("loginStatus").innerText =
      `Logged in as ${user.email}`;
    checkAlreadyVoted(user);
  }
});

// 🔑 Google Login
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

// 🔑 Facebook Login
function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider);
}

// 🚫 Check duplicate vote
function checkAlreadyVoted(user) {
  db.ref("votes").once("value", snap => {
    let voted = false;
    snap.forEach(child => {
      const v = child.val();
      if (
        v.email === user.email ||
        v.uid === user.uid ||
        v.ip === userIP
      ) voted = true;
    });

    if (voted) {
      window.location.href = "results.html";
    } else {
      document.getElementById("submitBtn").disabled = false;
    }
  });
}

// 🗳️ Submit vote
function submitVote() {
  if (!currentUser) return;

  const voteData = {
    uid: currentUser.uid,
    email: currentUser.email,
    provider: currentUser.providerData[0].providerId,
    ip: userIP,
    time: firebase.database.ServerValue.TIMESTAMP,
    name: name.value,
    vote: vote.value,
    location: location.value,
    parentPermission: parentPermission.value
  };

  db.ref("votes").push(voteData).then(() => {
    window.location.href = "results.html";
  });
}
