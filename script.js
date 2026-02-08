/* Firebase SDKs */
const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let loggedUser = null;

/* LOGIN */
window.loginGoogle = function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      loggedUser = result.user;
      alert("Google login success");
    })
    .catch(err => alert(err.message));
};

window.loginFacebook = function () {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      loggedUser = result.user;
      alert("Facebook login success");
    })
    .catch(err => alert(err.message));
};

/* Helpers */
function getDeviceInfo() {
  return navigator.userAgent;
}

async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  return (await res.json()).ip;
}

window.checkCustom = function () {
  document.getElementById("customVote").style.display =
    document.getElementById("vote").value === "custom" ? "block" : "none";
};

/* SUBMIT */
window.submitVote = async function () {

  if (!loggedUser) {
    alert("Please login first");
    return;
  }

  const name = document.getElementById("name").value.trim();
  if (!name) {
    alert("නම ඇතුලත් කරන්න");
    return;
  }

  const ip = await getIP();
  const snapshot = await db.ref("votes").once("value");

  let voted = false;
  snapshot.forEach(s => {
    const v = s.val();
    if (v.ip === ip || v.uid === loggedUser.uid || v.email === loggedUser.email) {
      voted = true;
    }
  });

  if (voted) {
    alert("ඔබ දැනටමත් vote කරලා!");
    return;
  }

  db.ref("votes").push({
    name,
    email: loggedUser.email || null,
    uid: loggedUser.uid,
    provider: loggedUser.providerData[0].providerId,
    providerUserId: loggedUser.providerData[0].uid,
    vote: document.getElementById("vote").value,
    customVote: document.getElementById("customVote").value,
    location: document.getElementById("location").value,
    travelTime: document.getElementById("travelTime").value,
    arrivalTime: document.getElementById("arrivalTime").value,
    parentPermission: document.getElementById("parentPermission").value,
    tripFrom: document.getElementById("tripFrom").value,
    tripTo: document.getElementById("tripTo").value,
    notAvailable: document.getElementById("notAvailable").value,
    ip,
    device: getDeviceInfo(),
    time: new Date().toISOString()
  });

  document.getElementById("status").innerText =
    "✅ Vote saved successfully";
};
