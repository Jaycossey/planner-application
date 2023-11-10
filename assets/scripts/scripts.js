// GLOBALS -----------------------------------------------------
const rootDiv = document.getElementById('root');
const dateDisplay = document.querySelector('.date');
const currentTime = document.querySelector('.current-time');

// Total time slots required
const timeSlotCount = 9;
const listEls = [];

// placeholders for inputs
const defaultPlaceholder = "No appointments set, click to add appointment";
const errorPlace = "Please input an appointment";

// appointment storageArray
let appointmentArray = [];


// Update CSS styles with time block ---------------------------
function updateCSS() {
    // set color scheme for li elements
    let past = "#adadad";
    let present = "#DC36F1";
    let future = "white";

    // get current time hour
    let currentTime = dayjs().format('HH');
    
    // store all li in temp array
    let elements = document.querySelectorAll('li');

    // for each element
    elements.forEach((li) => {
        // get id
        let timeBlock = li.id;
        // if id includes current time
        if (timeBlock.includes(currentTime)) {
            li.style.background = present;
        // else if id is still to come
        } else if ((timeBlock[0] + timeBlock[1]) > currentTime) {
            li.style.background = future;
        // else its in the past
        } else {
            li.style.background = past;
        }
    })
}

// Date and Time Functions -------------------------------------

// set and display current date
function displayDate() {
    let date = dayjs().format('DD/MM/YYYY');
    dateDisplay.innerText = date;
}

// Set and update time
function updateTime() {
    // update every second
    setInterval(() => {
        currentTime.innerText = dayjs().format('h:mm a');
    }, 1000);
}

// Planner Structure Elements ----------------------------------

// update current appointments on initial load
function updateCurrentAppointments() {
    // end function if no appointments
    if (localStorage.getItem('appointments') === null) return;

    // update array with currently stored apps
    appointmentArray = JSON.parse(localStorage.getItem('appointments'));

    // for each current appointment
    appointmentArray.forEach((object) => {
        let id = '#' + object.time;
        // if the id timeblock exists
        if ($(id)) {
            // handle updating attributes and text
            $(id).children('input').attr('disabled', true);
            $(id).children('input').attr('placeholder', object.appointmentString);
            $(id).children('button').text('Remove');
        }
    });

}

// create and return timeSlot elements
function createTimeSlots() {
    // create for every valid timeslot
    for (let i = 0; i < timeSlotCount; i++) {
        // dynamically set prefix for id's - makes CSS easier to edit
        let idPrefix = "";
        if (i === 0) {
            idPrefix = "0" + (i + timeSlotCount);
        } else {
            idPrefix = i + timeSlotCount;
        }
        // element and styling
        let element = document.createElement('li');
        element.textContent = idPrefix + ":00";
        element.id = idPrefix + "oclock";
        element.class = "time-slot";
        element.style.height = "50px";
        element.style.margin = "2px";
        element.style.borderRadius = "10px";
        element.style.paddingTop = "10px";
        element.style.paddingBottom = "auto";
        element.style.listStyle = "none";
        element.style.borderBottom = "4px solid purple";

        // push to array
        listEls.push(element);
    }

}

// function to display planner container
function displayPlanner() {
    // create list container and style
    const listContainer = document.createElement('ul');
    listContainer.style.width = "90%";
    listContainer.style.margin = "auto";
    listContainer.style.padding = "10px";
    listContainer.style.background = "white";
    listContainer.style.borderRadius = "20px";
    listContainer.style.border = "6px outset purple";

    // create slot list elements
    createTimeSlots();
    // append to container
    listEls.forEach((element) => {
        listContainer.append(element);
    })
    // append to parent div
    rootDiv.appendChild(listContainer);
}

// call functions
displayPlanner();


// Button Input and Remove -------------------------------------

// function to construct local storage object
class Appointment {
    // set appointment object time block and string
    constructor(time, appointmentString) {
        this.time = time;
        this.appointmentString = appointmentString;
    }
}

// add appointments to local
function addAppointment(time, string) {
    // if nothing exists in local storage
    if (localStorage.getItem('appointments') === null) {
        // create new appointment
        let appointment = new Appointment(time, string);
        // add to array
        appointmentArray.push(appointment);
        // set to local storage
        localStorage.setItem('appointments', JSON.stringify(appointmentArray));
    } else {
        // reassign appointment array with existing data then as above
        appointmentArray = JSON.parse(localStorage.getItem('appointments'));
        let appointment = new Appointment(time, string);
        appointmentArray.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointmentArray));
    }

    return;
}

// remove appointments from local
function removeAppointment(targetTime, target) {
    // update array with current stored appointments    
    appointmentArray = JSON.parse(localStorage.getItem('appointments'));
    // remove target appointment
    appointmentArray = appointmentArray.filter(item => item.time !== targetTime);
    // update local storage
    localStorage.setItem('appointments', JSON.stringify(appointmentArray));

    // reset input display
    target.value = "";
    target.placeholder = defaultPlaceholder;

    return;
}

// Event listener for buttons
function toggleAppointment(event) {
    // assign relative input 
    let input = event.target.previousSibling;
    // assign text value from respective input element
    let targetInput = input.value;
    let targetTime = $(event.target).parent().attr('id');

    // if valid input
    if (event.target.textContent === "Add" && targetInput !== "") {
        // add appointment and switch button text
        addAppointment(targetTime, targetInput);
        event.target.textContent = "Remove";
        input.setAttribute('disabled', true);
    // else if removing an appointment
    } else if (event.target.textContent === "Remove") {
        input.removeAttribute('disabled');
        // remove appointment from list and toggle button text
        removeAppointment(targetTime, event.target.previousSibling);
        event.target.textContent = "Add";
    // else if user doesnt input valid string
    } else if (targetInput === "") {
        event.target.previousSibling.placeholder = errorPlace;
    }

    return;
}


// List Element Functions jQuery -------------------------------

// Appointment input els
$('li').append('<br><input class="border-left input" value=""></input>');
$('.input').attr('placeholder', defaultPlaceholder);
$('.border-left').css('border', 'none');
$('.border-left').css('border-bottom', '2px solid purple');
$('.border-left').css('border-left', '2px solid purple');
$('.border-left').css('margin-left', '40px');
$('.border-left').css('padding-left', '40px');
$('.border-left').css('width', '60%');

// Remove button el
$('li').append('<button type="button" onclick="{toggleAppointment(event)}">Add</button>');
$('button').css('width', '60px');
$('button').css('margin-left', '20%');

displayDate();
updateTime();
updateCurrentAppointments();
updateCSS();