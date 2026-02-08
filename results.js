import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function loadResults() {
  const snapshot = await get(child(ref(db), "votes"));
  const list = document.getElementById("resultsList");
  list.innerHTML = "";

  if (!snapshot.exists()) {
    list.innerHTML = "<li>No votes yet</li>";
    return;
  }

  const counts = {};

  snapshot.forEach(s => {
    const v = s.val();
    const place = v.vote === "custom" && v.customVote ? v.customVote : v.vote;
    counts[place] = (counts[place] || 0) + 1;
  });

  for (const place in counts) {
    const li = document.createElement("li");
    li.textContent = `${place} — ${counts[place]} votes`;
    list.appendChild(li);
  }
}

loadResults();
