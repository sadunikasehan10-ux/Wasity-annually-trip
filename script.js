// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD5xIjemUx_rH4TzFBW_TJQ0Q7crdJ7IvY",
  authDomain: "wasity-trip.firebaseapp.com",
  databaseURL: "https://wasity-trip-default-rtdb.firebaseio.com",
  projectId: "wasity-trip"
};


// Firebase start
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// 📱 Device info
function getDeviceInfo(){
   return navigator.userAgent;
}


// 🌍 Get IP
async function getIP(){
    let res = await fetch("https://api.ipify.org?format=json");
    let data = await res.json();
    return data.ip;
}


// 🗳 Submit Vote
window.submitVote = async function(){

    const name = document.getElementById("name").value;
    const vote = document.getElementById("vote").value;
    const status = document.getElementById("status");

    if(name === ""){
        alert("නම දාන්න");
        return;
    }

    const ip = await getIP();
    const device = getDeviceInfo();
    const time = new Date().toLocaleString();

    // 🔒 Check duplicate IP
    const dbRef = ref(db);

    get(child(dbRef,"votes")).then(snapshot => {

        if(snapshot.exists()){

            let voted = false;

            snapshot.forEach(childSnap => {

                if(childSnap.val().ip === ip){
                    voted = true;
                }

            });

            if(voted){
                alert("ඔබ දැනටමත් vote කරලා!");
                return;
            }

            saveVote();

        }
        else{
            saveVote();
        }

    });


    function saveVote(){

        push(ref(db,"votes"),{
            name: name,
            vote: vote,
            ip: ip,
            device: device,
            time: time
        });

        status.innerText = "Vote saved successfully!";
    }

}
