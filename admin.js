firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com"
});

firebase.database().ref("votes").on("value", snap => {
  const tbody = document.getElementById("rows");
  tbody.innerHTML = "";
  snap.forEach(s => {
    const v = s.val();
    tbody.innerHTML += `
      <tr>
        <td>${v.name}</td>
        <td>${v.email}</td>
        <td>${v.vote}</td>
        <td>${v.ip}</td>
      </tr>`;
  });
});
