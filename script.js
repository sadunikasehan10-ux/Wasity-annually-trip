import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


function getDeviceInfo(){
   return navigator.userAgent;
}

async function getIP(){
    let res = await fetch("https://api.ipify.org?format=json");
    let data = await res.json();
    return data.ip;
}


window.submitVote = async function(){

    const name = document.getElementById("name").value;
    const vote = document.getElementById("vote").value;

    if(name === ""){
        alert("නම දාන්න");
        return;
    }

    const ip = await getIP();
    const device = getDeviceInfo();
    const time = new Date().toLocaleString();

    const snapshot = await get(ref(db,"votes"));

    let voted = false;

    if(snapshot.exists()){
        snapshot.forEach(child => {
            if(child.val().ip === ip){
                voted = true;
            }
        });
    }

    if(voted){
        alert("ඔබ දැනටමත් vote කරලා!");
        return;
    }

    await push(ref(db,"votes"),{
        name: name,
        vote: vote,
        ip: ip,
        device: device,
        time: time
    });

    alert("Vote Saved!");
}
