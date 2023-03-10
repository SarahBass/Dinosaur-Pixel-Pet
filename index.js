/*
----------------------------------------------
 *  Project:   Pixel Pet Dinosaur Clock Face
 *  Mail:       darahbass@gmail.com
 *  Github:     SarahBass
 ---------------------------------------------
 NOTES: 
 This Clock will be larger than normal
 because it has so many animations. 
 
 Images are ALL original artwork 
 ---------------------------------------------
*/

/*--- Import Information from user Account ---*/
import { settingsStorage } from "settings";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from 'power';
import { display } from "display";
import { today as userActivity } from "user-activity";
import {goals, today} from "user-activity";
import { units } from "user-settings";
import * as document from "document";
import { Accelerometer } from "accelerometer";


/*--- Create Local Variables for Information Storage ---*/
let daytext = "day";
let monthtext = "month";
let goalreached = "NONE";


/*--- Import Information from index.gui ---*/

let background = document.getElementById("background");
let ampm = document.getElementById("ampm");  
let evolution = document.getElementById("evolution"); 
let date = document.getElementById("date");
let pet = document.getElementById("pet");
let object = document.getElementById("object");
let poop = document.getElementById("poop");
let buttonnumber = 0;
let poops = 0;
let petnaughty = 0;
let basic = 0;
let pets = 0;
let version = 0;
let annoy = 0;
let sad = 0;
let age = 0;

//Update the clock every second 
clock.granularity = "seconds";

// Get a handle on the <text> elements 
const myLabel = document.getElementById("myLabel");
const batteryLabel = document.getElementById("batteryLabel");
const stepsLabel = document.getElementById("stepsLabel");
const firelabel = document.getElementById("firelabel");
const boltlabel = document.getElementById("boltlabel");
const heartlabel = document.getElementById("heartlabel");
const stairslabel = document.getElementById("stairslabel");
const distancelabel = document.getElementById("distancelabel");
const button2 = document.getElementById("button-1");
const button1 = document.getElementById("button-2");
var demoinstance = document.getElementById("demoinstance");
var demogroup = demoinstance.getElementById("demogroup");

  
  if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
   const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    heartlabel.text = (`${hrm.heartRate}`);

  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
  }else {heartlabel.text = "off";}



/*--- CLOCK START ---*/
clock.ontick = (evt) => {

  let today = evt.date;
  let hours = today.getHours();
  let months = today.getMonth();
  let days = today.getDay();
  let dates = today.getDate();
  let years = today.getFullYear();
  let mins = util.zeroPad(today.getMinutes());
  let seconds = today.getSeconds();
  
  demoinstance.animate("enable"); 

 /*--- Update Stats for Screen ---*/
  updateScene();
  if (units.distance == "us"){
  distancelabel.text = (0.000621371 * userActivity.adjusted.distance).toFixed(1) + " mi";}
  else {distancelabel.text = (0.001 * userActivity.adjusted.distance).toFixed(1) + " km";}

  stairslabel.text = userActivity.adjusted.elevationGain;
  stepsLabel.text = userActivity.adjusted.steps;
  firelabel.text = userActivity.adjusted.calories;
  boltlabel.text = userActivity.adjusted.activeZoneMinutes.total;
  heartlabel.text = "off";  
  checkAndUpdateBatteryLevel();


  
  //AM PM -Change the image based on 24 hours
  if (util.zeroPad(hours) >= 12){ampm.text = "PM";}
  else{ampm.text = "AM";}
  
  
  //Backgrounds based on day. Game Over has special background

if (userActivity.adjusted.steps > goals.steps){background.image = "Gameover.jpeg";}
  else{background.image = days + ".jpeg";}
  

  
  
 //Pet creates waste based on time
  if (userActivity.adjusted.steps%25 == 0){poops++; sad--;}
  if (poops < 0 ) {poops = 0;}
  if (poops > 3){poops = 3}
  
   //Pet gets annoyed based on steps
  if ((userActivity.adjusted.steps%30) == 0){annoy++;}
  if (annoy < 0 ) {annoy = 0;}
  if (annoy > 3){annoy = 3}
  
  //Not Cleaning makes Pet Naughty to level 1000
  if ( petnaughty > 100){petnaughty = 100;}
  if (petnaughty < 0){petnaughty = 0;}
  
  //Sleeping increases cuteness level of form to level 1000
  if (basic > 100){basic = 100;}
  if (basic < 0){basic = 0;} 
  
    //Annoying Critters increases sadness
  if (sad >= 100){sad = 100;}
  if (sad <= 0){sad = 0;} 
  

 //Reset stats at midnight
if ((util.zeroPad(hours) == 0)&& (mins == 1)){
  petnaughty = 0;
  poops = 0;
  basic = 0;
  sad = 0;
  annoy= 0;
}
  
   //Button to give health
   button2.onclick = function(evt) { 
   petnaughty-=20;
   poops --;  
   annoy--;  
   console.log("Basic Level: " + basic);
   console.log("Naughty Level: " + petnaughty);
   poop.image = "poop/heart.png"; }
  
  //Functions to control screen animations
  cleanpoops();
  showPoop();
  showDino();
  showHearts();
  showSleep();
  
  
   /*--- OPTION 2: TIME IMAGES FOR 12 HOUR CLOCK---*/
  //set class of each # IMAGE individually if needed for formatting
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }else {hours = util.zeroPad(hours);}
  myLabel.text = `${hours}:${mins}`; 
  /*----------------------------SHOW CLOCK END----------------------------------*/                      

/*
  /*--- Battery Functions ---*/
  display.addEventListener('change', function () { if (this.on) {checkAndUpdateBatteryLevel();}
                                             
});
/*----------------------------END OF ON TICK-----------------------------------*/
  
/*----------------------------START OF FUNCTIONS--------------------------------*/

 /*--- Change Battery RED , GREEN & CHARGE ---*/  

function checkAndUpdateBatteryLevel() {
  batteryLabel.text = `${battery.chargeLevel}%`;
  if (battery.chargeLevel > 30){ batteryLabel.class = "labelgreen";}
  else {batteryLabel.class = "labelred";
        battery.onchange = (charger, evt) => {batteryLabel.class = "labelgreen";}}
}
 
  
  function cleanpoops(){
    if (Accelerometer) {
   //console.log("Poop Level: " + poops);
   //console.log("Naughty Level: " + petnaughty);
   //console.log("Basic Level: " + basic);
   const accelerometer = new Accelerometer({ frequency: 30, batch: 60 });
   accelerometer.addEventListener("reading", () => { 
    if (accelerometer.y > 6 && accelerometer.x > 6 && accelerometer.z > 6){   
      annoy--;
      poops--;
      sad--;
    }
     
  });  
    display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? accel.start() : accel.stop();
  });
       accelerometer.start();
  }
  else {console.log("This device does NOT have an Accelerometer!");}
  
  
  }
  
  
  
  function showSleep(){
    button1.onclick = function(evt) { buttonnumber++; }

  if (buttonnumber == 1){
                    distancelabel.class = "labelseeblue";
                    firelabel.class  = "labelseeblue";
                    boltlabel.class  = "labelseeblue";
                    heartlabel.class  = "labelseeblue";
                    stairslabel.class  = "labelseeblue";
                    evolution.class = "none";
                    basic+=10;
                    
                      if (seconds % 2 == 0){object.image = "read.jpeg";}
                      else{object.image = "read1.jpeg";}
  }else{
                    buttonnumber = 0;
                    distancelabel.class = "none";
                    firelabel.class  = "none";
                    boltlabel.class  = "none";
                    heartlabel.class  = "none";
                    stairslabel.class  = "none";
                    object.image = "blank.png";
                    evolution.class = "meter";
    
  }
  }
  
  
  
  
  function showHearts(){
    if (userActivity.adjusted.steps < goals.steps/5){evolution.text = "???";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) {evolution.text = "??????";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5)))
  {evolution.text = "?????????";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {evolution.text = "????????????";}
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {evolution.text = "???????????????";}
  else if (userActivity.adjusted.steps > goals.steps){evolution.text = "??????????????????";}
  else {evolution.text = "";}
  }
 function showPoop() {
  // If in egg show snakes instead of poops
  if (userActivity.adjusted.steps < goals.steps/5 ){
  if (poops == 0) { poop.image ="blank.png"}
  else if (poops == 1) {
    petnaughty++;
     if (seconds % 2 == 0){poop.image = "poop/snake0.png";}
     else{poop.image = "poop/snake1.png";}}
  else if (poops == 2) {
    basic--;
     if (seconds % 2 == 0){poop.image = "poop/snake2.png";}
     else{poop.image = "poop/snake3.png";}}
  else if (poops > 2) {
    sad++;
     if (seconds % 2 == 0){poop.image = "poop/snake4.png";}
     else{poop.image = "poop/snake5.png";}}
    
  }
  
  //if not an egg or not a ghost , show poops or enemies
  
  else if ((userActivity.adjusted.steps >= goals.steps/5) &&  (userActivity.adjusted.steps < goals.steps)){
    
  if (annoy > 0) { 
    poop.image = "poop/annoy" + (parseInt(mins/10)) + "s"+ seconds%2+ ".png";
    sad ++;
  }else{
    petnaughty++;
    poop.image = "poop/poop" + poops + "s"+ seconds%2+ ".png";
  }
  
  
    //If a ghost, show game over + seconds%2 + ".png";
  } else if (userActivity.adjusted.steps >= goals.steps) {
      if (petnaughty > age){poop.image = "poop/gameoverv0a" + seconds%2 + ".png";}
      else if (basic > age ){poop.image = "poop/gameoverv1a" + seconds%2 + ".png";}
      else {poop.image = "poop/gameoverv2a" + seconds%2 + ".png";}
    }
    //last else statement - show blank
  else {poop.image = "blank.png";}
 }
  
  function showDino(){
  //Change version number based on stats
    if (userActivity.adjusted.steps < goals.steps){   
    if (basic > age) {
      if (petnaughty > age ) {
        version = 0;}
      else { version = 1; }
    }else {
       if (petnaughty > age) {version = 4;}
      else { 
        if (sad > age ) {version=2;}
       else {version = 3;} }
      }
  }else{
        version = 0;
  }
  //0 is red monster
  //1 is Triceratops 
  //2 is longneck
  //3 show most it is the raptor
  //4 is the weird one 
    //----------Pet Evolution Baby Pet -------------------
  
  //--------------CHANGE PET FORM IN FOREGROUND ------------------
  //pet/pet3v0a1.png
pet.image = "pet/pet" + pets + "v" + version + "a" + seconds%2 + ".png";
    //----------Pet Evolution Egg -------------------
  if (userActivity.adjusted.steps < goals.steps/5){
  pets = 0;
  age = 10;}
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) {
         pets = 1;
         age = 20;
  }
  //----------Pet Evolution Mini Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5))){
         pets = 2;
         age = 30;
  }
  
    //----------Pet Evolution Cup Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {
             pets = 3;
             age = 40;
           }
  
    //----------Pet Evolution Adult Pet -------------------
  
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {
             pets = 4;
             age = 50;
           }
  //---------Game Over Pet ------------------
  
  else if (userActivity.adjusted.steps > goals.steps){
    
    pets = 5;
    age = 10;
    
  } else {
    pets = 0;
    age = 10;
  }}
  
/*--- Change Date and Background Functions ---*/

  function updateScene() {

   date.text = " " + daytext + " " + monthtext + " " + dates + " " + years + " ";  
  if (months == 0){monthtext = "January";}
  else if (months == 1){monthtext =  "February";}
  else if (months == 2){monthtext =  "March";}
  else if (months == 3){monthtext =  "April";}
  else if (months == 4){monthtext =  "May";}
  else if (months == 5){monthtext =  "June";}
  else if (months == 6){monthtext =  "July";}
  else if (months == 7){monthtext =  "August";}
  else if (months == 8){monthtext =  "Septemper";}
  else if (months == 9){monthtext =  "October";}
  else if (months == 10){monthtext = "November";}
  else if (months == 11){monthtext = "December";}
  else {monthtext = "MONTH";}
    
  if (days == 0){daytext =      "Sunday,";}
  else if (days == 1){daytext = "Monday,";}
  else if (days == 2){daytext = "Tuesday,";}
  else if (days == 3){daytext = "Wednesday,";}
  else if (days == 4){daytext = "Thursday,";}
  else if (days == 5){daytext = "Friday,";}
  else if (days == 6){daytext = "Saturday,";}
  else {daytext = "DAY";}
 }

}
/*----------------------------END OF FUNCTIONS--------------------------------*/
/*-------------------------------END OF CODE----------------------------------*/
