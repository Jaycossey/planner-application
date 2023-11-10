// GLOBALS -----------------------------------------------------
const rootDiv = document.getElementById('root');
const dateDisplay = document.querySelector('.date');
const currentTime = document.querySelector('.current-time');

// Total time slots required
const timeSlotCount = 9;
const listEls = [];

// Date and Time Functions -------------------------------------

// set and display current date
function displayDate() {
    let date = dayjs().format('DD/MM/YYYY');
    dateDisplay.innerText = date;
}

// Set and update time
function updateTime() {
    setInterval(() => {
        currentTime.innerText = dayjs().format('h:mm a');
    }, 1000);
}

// Planner Structure Elements ----------------------------------

// create and return timeSlot elements
function createTimeSlots() {
    for (let i = 0; i < timeSlotCount; i++) {
        let element = document.createElement('li');
        element.name = i + 8;
        element.class = "time-slot";
        element.style.height = "50px";
        element.style.marginLeft = "auto";
        element.style.marginRight = "auto";
        element.style.padding = "auto";
        element.style.listStyle = "none";

        listEls.push(element);
    }

}

function displayPlanner() {
    const listContainer = document.createElement('ul');
    listContainer.style.width = "90%";
    listContainer.style.margin = "auto";
    listContainer.style.background = "white";
    listContainer.style.borderRadius = "20px";
    listContainer.style.border = "6px outset purple";

    createTimeSlots();
    
    listEls.forEach((element) => {
        listContainer.append(element);
    })
    
    rootDiv.appendChild(listContainer);
}
displayPlanner();

// List Element Functions -----------------------------
/**
 * This will handle the functionality for each li item
 * When I click a li time block, then i can input a task
 * When the time updates, the CSS displays greyed (dark purple) out past
 *                  mid purple current time
 *                  light pruple for future time 
 */


displayDate();
updateTime();