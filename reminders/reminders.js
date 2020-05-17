//those are bound html elements to js code
let reminderList = $('#reminder-list')
let addForm = $('#add-form')
let editForm = $('#edit-form')
let buttonAdd = $('#button-add')
let buttonEdit = $('#button-edit')
let editId = $('#edit-id')
let editDay = $('#edit-day')
let editHours = $('#edit-hours')
let editMinutes = $('#edit-minutes')

const DAY_OF_WEEKS = {
    "Sun": 0,
    "Mon": 1,
    "Tue": 2,
    "Wed": 3,
    "Thu": 4,
    "Fri": 5,
    "Sat": 6
}

//it is initial state for reminders
let reminderState = [
]

//this function is triggered when you add reminder on add reminder form
const addItem = (activity, day, hours, minutes) => {
    let entity = {              //create new reminder
        id: getRandomId(),
        activity: activity,
        day: day,
        hours: +hours,
        minutes: +minutes
    }
    reminderState = reminderState.concat(entity)        //add reminder to state
    localStorage.setItem('reminderState', JSON.stringify(reminderState))  //update local storage to save cache
    schedule(entity)                                                        //this one schedule notification
    render()                                                // this one apply convert reminder state to html
    reminderList.listview().listview('refresh');            // this one specific for jquery ui component to update reminder list
}

//this function schedules notification in particular time. see findClosestSchedule
const schedule = (entity) => {
    //it triggers notification schedule
    entity.notification = setTimeout(() => {
        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(`Do ${entity.activity}`,
                        {
                            icon: '/my_backyard/img/icon.png',
                            badge: '/my_backyard/img/icon.png',
                            image: '/my_backyard/img/icon.png',
                        });
                });
            }
        });
        reschedule(entity)
    }, findClosestSchedule(entity))
}


//it calculates the time of next notification
//the key here is to find the real date of next Monday or Tuesday for example, create date object and after
//do assumedDate - currentDate -> diff in milliseconds -> schedule in found time



const findClosestSchedule = (reminder) => {
    let currentDate = new Date()
    let currentDay = currentDate.getDay()
    let reminderDay = DAY_OF_WEEKS[reminder.day]
    let diffDay = reminderDay - currentDay >= 0 ? reminderDay - currentDay : 7 + (reminderDay - currentDay)
    if (diffDay === 0) {
        let assumedAlertTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            reminder.hours,
            reminder.minutes
        )
        let diff = assumedAlertTime - currentDate
        if (diff > 0) {
            return diff
        } else {
            return diff + (7 * 24 * 60 * 60 * 1000)
        }
    } else {
        let dateCopy = new Date(currentDate)
        let assumedDate = new Date(dateCopy.setDate(currentDate.getDate() + diffDay))
        let assumedAlertTime = new Date(
            assumedDate.getFullYear(),
            assumedDate.getMonth(),
            assumedDate.getDate(),
            reminder.hours,
            reminder.minutes
        )
        return assumedAlertTime - currentDate
    }
}

//this one reschedule notification directly in one week after first notification is triggered,
//very easy, just calculate amount of millis in 7 days
const reschedule = (entity) => {
    let interval = 1000 * 60 * 60 * 24 * 7
    console.log(interval)
    entity.notification = setTimeout(() => {
        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(`Do ${entity.activity}`,
                        {
                            icon: '/my_backyard/img/icon.png',
                            badge: '/my_backyard/img/icon.png',
                            image: '/my_backyard/img/icon.png',
                        });
                });
            }
        });
        reschedule(entity)
    }, interval)
}


//this one triggers when you submit edit form
const editItem = (id, activity, day, hours, minutes) => {
    reminderState = reminderState.map(item => {
            if (item.id === id) {
                item.activity = activity
                item.day = day
                item.hours = +hours
                item.minutes = +minutes
                clearTimeout(item.notification)     //you need to reset notification and create new one, may be you edit time, old notification is not valid anymore
                item.notification = schedule(item)
            }
            return item
        }
    )
    localStorage.setItem('reminderState', JSON.stringify(reminderState))   //store reminders in cache
    render()                            //render view
    reminderList.listview().listview('refresh');  //again jquery mobile specific operation for list refresh
}


//triggered when you delete reminder
const deleteItem = (id) => {
    let itemToDelete = reminderState.find(item => item.id === id)
    clearTimeout(itemToDelete.notification)                         //clear notification, it is not scheduled anymore
    reminderState = reminderState.filter(item => item.id !== id)
    localStorage.setItem('reminderState', JSON.stringify(reminderState))        //update cache
    render()                                                                    //update view
    reminderList.listview('refresh')                                            //specific update for jquery mobile
}

//event listener for add form submission, grab data from form and add it to state
addForm.submit(ev => {
    ev.preventDefault()
    let form = ev.target
    let activity = form['activity'].value
    let day = form['add-day'].value
    let hours = form['hours'].value
    let minutes = form['minutes'].value
    addItem(activity, day, hours, minutes)
})


//event listener for edit form submission, grab data from form and edit state
editForm.submit(ev => {
    ev.preventDefault()
    let form = ev.target
    let id = form['id'].value
    let activity = form['edit-activity'].value
    let day = form['edit-day'].value
    let hours = form['edit-hours'].value
    let minutes = form['edit-minutes'].value
    editItem(+id, activity, day, hours, minutes)
})

//submit add form
buttonAdd.click(() => {
    try {
        Promise.resolve(Notification.requestPermission())
            .then(function (permission) {
            })
    } catch(e) {
        console.log(e)
    }
    addForm.submit()
})

//submit edit form
buttonEdit.click(() => {
    try {
        Promise.resolve(Notification.requestPermission())
            .then(function (permission) {
            })
    } catch(e) {
        console.log(e)
    }
    editForm.submit()
})


//this one writes the data from state to edit form, to reflect exactly the reminder you want to edit
handleEdit = (id) => {
    let reminder = reminderState.find(item => item.id === id)
    editId.val(reminder.id)                                         //expose id
    $('input:radio[name=edit-activity]').each(function () {
        $(this).prop('checked', false);
        $(this).checkboxradio().checkboxradio("refresh")
    });
    let element = $("input[name=edit-activity][value=" + reminder.activity + "]")
    element.prop('checked', true);
    element.checkboxradio().checkboxradio("refresh")
    editDay.val(reminder.day).attr('selected', true).siblings('option').removeAttr('selected');     //expose day
    editDay.selectmenu().selectmenu("refresh", true);
    editHours.val(formatTime(reminder.hours))           //expose time
    editMinutes.val(formatTime(reminder.minutes))
}


//this one is html representation of whole list
const reminderListComponent = (reminderState) => {
    let list = reminderState.map(item => `<li>${reminderListItem(item)}</li>`).join('')
    return `${list}`
}

//this one is html representation of one list item
const reminderListItem = (itemProps) => {
    return `
        <h1>${itemProps.activity}</h1>
        <p>${itemProps.day}</p>
        <p class='ui-listview-item-aside'>
            <strong>${formatTime(itemProps.hours)}:${formatTime(itemProps.minutes)}</strong>
        </p>
        <div class="ui-btn-right">
            <a href="#Edit" class="ui-btn ui-btn-inline ui-corner-all ui-icon-edit ui-btn-icon-notext"
            onclick="handleEdit(${itemProps.id})">
                Edit
            </a>
            <button class="ui-btn ui-btn-inline ui-corner-all ui-icon-delete ui-btn-icon-notext" 
                onclick="deleteItem(${itemProps.id})">
                Delete
            </button>
        </div>
        `
}

//this one formats time from 0:0 -> 00:00
const formatTime = (timeUnit) => {
    let stringTimeUnit = timeUnit.toString()
    if(stringTimeUnit.length === 1) {
        return `0${timeUnit}`
    }
    return stringTimeUnit
}

const getRandomId = () => {
    return Math.floor(Math.random() * 100000000)
}

//this one push generated html to html container with particular id
const render = () => {
    reminderList.html(reminderListComponent(reminderState))
}

//it executes directly after page loaded, get reminders from cache
let savedItems = localStorage.getItem('reminderState')

//if cache exists it convert it state and schedule notification for each item from cache
if (savedItems) {
    reminderState = JSON.parse(savedItems)
    reminderState.forEach(item => schedule(item))
} else {
    reminderState = []
}

//and in the end it renders the state on initial launch
render()
