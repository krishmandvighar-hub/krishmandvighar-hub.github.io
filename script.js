// ===============================
// Typing Animation
// ===============================


const roles = [
    "Data Analyst",
    "Python Developer",
    "SQL Enthusiast",
    "Power BI Learner",
    "Data Visualization Expert"
];


let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;


const typingText = document.getElementById("typing-text");


function typingEffect(){


    if(!typingText) return;


    let currentRole = roles[roleIndex];


    if(!isDeleting){

        typingText.textContent =
        currentRole.substring(0,charIndex++);

    }
    else{

        typingText.textContent =
        currentRole.substring(0,charIndex--);

    }



    if(!isDeleting && charIndex === currentRole.length){

        setTimeout(()=>{

            isDeleting=true;

        },1200);

    }



    if(isDeleting && charIndex===0){

        isDeleting=false;

        roleIndex++;

        if(roleIndex===roles.length){

            roleIndex=0;

        }

    }


    setTimeout(
        typingEffect,
        isDeleting ? 50 : 120
    );

}


typingEffect();






// ===============================
// Dark / Light Theme
// ===============================


function toggleTheme(){

    document.body.classList.toggle("light");

}







// ===============================
// Footer Year
// ===============================


const year = document.getElementById("year");


if(year){

    year.textContent = new Date().getFullYear();

}






// ===============================
// Scroll Reveal Animation
// ===============================


const cards = document.querySelectorAll(
".card, .glass, .skill"
);



const observer = new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";


}


});


},
{
threshold:0.15
}

);



cards.forEach(card=>{


card.style.opacity="0";

card.style.transform="translateY(40px)";

card.style.transition="0.6s ease";


observer.observe(card);


});






// ===============================
// Active Navbar Highlight
// ===============================


const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav ul li a");



window.addEventListener("scroll",()=>{


let current="";


sections.forEach(section=>{


const sectionTop =
section.offsetTop - 150;


if(scrollY >= sectionTop){

current =
section.getAttribute("id");

}


});



navLinks.forEach(link=>{


link.style.color="";


if(link.getAttribute("href")
===" #"+current){

link.style.color="#38bdf8";

}


});


});






// ===============================
// Button Ripple Effect
// ===============================


const buttons =
document.querySelectorAll(".btn");



buttons.forEach(button=>{


button.addEventListener("click",function(e){


let ripple=document.createElement("span");


ripple.className="ripple";


this.appendChild(ripple);



setTimeout(()=>{

ripple.remove();

},600);



});


});







// ===============================
// Page Load Animation
// ===============================


window.addEventListener("load",()=>{


document.body.classList.add("loaded");


});