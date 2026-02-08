firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  db.ref("votes").once("value", snap => {
    const totalVotes = snap.numChildren();
    let myVote = "N/A";

    snap.forEach(child => {
      if (child.val().email === user.email) {
        myVote = child.val().vote;
      }
    });

    document.getElementById("summary").innerText =
      `Total Votes: ${totalVotes}`;

    document.getElementById("myVote").innerText =
      `Your Vote: ${myVote}`;
  });
});
