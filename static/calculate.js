function addLeadingZero(number) {
    const paddedString = String(number).padStart(2, "0");
    return paddedString;
}

const counter_elements = [ 
    document.getElementById('counter_0'),
    document.getElementById('counter_1'),
    document.getElementById('counter_2'),
    document.getElementById('counter_3'),
]

function incrementCounter(counter, currentValue, targetValue) {
    // Increment the current value
    // check if it already reeached the target
    if (currentValue != targetValue) {
        currentValue++;
    }

    // Update the counter display
    counter.textContent = addLeadingZero(currentValue); //using addLeadingZero

   // Check if it reached the targetValue, if not call the fn again
    if (currentValue < targetValue - 1) {
        // Schedule the next incrementing after 1 second
        setTimeout(() => {
            incrementCounter(counter, currentValue, targetValue);
        }, 50);
    }
    else if (currentValue < targetValue) {
        // Schedule the last two increments after some more time
        setTimeout(() => {
            incrementCounter(counter, currentValue, targetValue);            
        }, 500);
    }
}

// Getting the initial value from the form
let days = document.getElementById('days').value;
let hours = document.getElementById('hours').value;
let minutes = document.getElementById('minutes').value;

// Calling the function to put the initial values when the page reloads
window.onload = function() {
    incrementCounter(counter_elements[1], 0, days);
    incrementCounter(counter_elements[2], 0, hours);
    incrementCounter(counter_elements[3], 0, minutes);
    
    // changing the image displaying show's running data
    let status = document.getElementById('status').value;
    if (status == "Ended") {
        document.getElementById('finished_img').style.display = "block";
    }
    else if (status == "Returning Series") {
        document.getElementById('returning_img').style.display = "block";
    }
    
};

function processData() {
    const hours_per_day = parseInt(document.getElementById('user_hours').value);
    let minutes_per_day = parseInt(document.getElementById('user_minutes').value);
    const days_per_week = parseInt(document.getElementById('user_days').value);
    
    // Eventhough it's already done on frontend, but just in case
    if (hours_per_day < 0 || hours_per_day > 24 || minutes_per_day < 0 || minutes_per_day > 60 || days_per_week < 0 || days_per_week > 7) {
        alert("Don't be cheeky");
        return false;
    }

    // Logic for atleast filling one input box and filling the days box
    if (hours_per_day == 0 && minutes_per_day == 0) {
        alert('either hours or minutes input must be filled');
        return false;
    }
    if (days_per_week == 0) {
        alert('the days input must be filled');
        return false;        
    }
    // Making sure the user doesn't input hours=24 and minutes > 0
    if (hours_per_day == 24 && minutes_per_day > 0) {
        alert('A day has only 24 hours');

        // Change the minutes field to 0
        document.getElementById('minutes').value = "0";

        return false;
    }


    // Accessing the info given by flask
    let name = document.getElementById('name').value;
    let total_time = document.getElementById('total_time').value;

    // Updating minutes_per_day, adding hours_per_day
    minutes_per_day += (hours_per_day * 60)

    // Calculating the result
    var minutes = 0;
    var hours = 0;
    var weeks = 0;
    var days = parseInt(total_time / minutes_per_day);
    weeks = parseInt(days / days_per_week);
    days = parseInt(days % days_per_week);

    // To check if the line 11 has a remainder
    // Incrementing the day even if the only some minutes sre left
    let remainder = parseInt(total_time % minutes_per_day)
    if (remainder > 0) {
        if (remainder > 60) {
            hours = parseInt(remainder / 60);
            minutes = parseInt(remainder % 60);
        }
        else {
            minutes = remainder
        }
    }

    // Changing timer description
    if (weeks == 1) {
        document.getElementById('weeks_desc').textContent = "WEEK";
    }
    if (days == 1) {
        document.getElementById('days_desc').textContent = "DAY";
    }
    if (hours == 1) {
        document.getElementById('hours_desc').textContent = "HOUR";
    }
    if (minutes == 1) {
        document.getElementById('minutes_desc').textContent = "MINUTE";
    }

    // Changing the initial value to the calculated value
    incrementCounter(counter_elements[0], 0, weeks);
    incrementCounter(counter_elements[1], 0, days);
    incrementCounter(counter_elements[2], 0, hours);
    incrementCounter(counter_elements[3], 0, minutes);    
}


// function to submit the form when the user clicks enter
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        processData();
    }
})