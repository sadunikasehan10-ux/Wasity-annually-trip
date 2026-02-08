const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let userIP = "";

// 🌍 IP
fetch("https://api.ipify.org?format=json")
  .then(r => r.json())
  .then(d => userIP = d.ip);

// 🔐 Auth watcher
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loginStatus.innerText = `Logged in as ${user.email}`;
    checkIfAlreadyVoted();
  } else {
    submitBtn.disabled = true;
  }
});

function loginGoogle() {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function loginFacebook() {
  auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
}

// 🚫 Duplicate check
function checkIfAlreadyVoted() {
  db.ref("votes").once("value", snap => {
    let voted = false;
    snap.forEach(c => {
      const v = c.val();
      if (
        v.email === currentUser.email ||
        v.uid === currentUser.uid ||
        v.ip === userIP
      ) voted = true;
    });

    if (voted) {
      location.href = "results.html";
    } else {
      submitBtn.disabled = false;
    }
  });
}

// 🗳️ Submit
function submitVote() {
  if (!currentUser) return;

  const finalVote =
    vote.value === "custom" ? customVote.value : vote.value;

  const data = {
    uid: currentUser.uid,
    email: currentUser.email,
    provider: currentUser.providerData[0].providerId,
    ip: userIP,
    voteTime: firebase.database.ServerValue.TIMESTAMP,
    name: name.value,
    vote: finalVote,
    location: location.value,
    travelTime: travelTime.value,
    arrivalTime: arrivalTime.value,
    parentPermission: parentPermission.value,
    tripFrom: tripFrom.value,
    tripTo: tripTo.value,
    notAvailable: notAvailable.value
  };

  db.ref("votes").push(data).then(() => {
    location.href = "results.html";
  });
}

// 👁 Custom vote toggle (original behavior)
function checkCustom() {
  customVote.style.display =
    vote.value === "custom" ? "block" : "none";
}
