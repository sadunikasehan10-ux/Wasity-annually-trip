async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

document.getElementById("submitBtn").addEventListener("click", async () => {
  const ip = await getIP();
  alert("Your IP is: " + ip);
});
