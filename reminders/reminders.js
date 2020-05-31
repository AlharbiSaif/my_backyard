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
let editZone = $('#edit-zone')

const DAY_OF_WEEKS = {
    "Sun": 0,
    "Mon": 1,
    "Tue": 2,
    "Wed": 3,
    "Thu": 4,
    "Fri": 5,
    "Sat": 6
}

let reminderState = []

const addItems = (activity, days, hours, minutes, ampm) => {
    for (let i = 0; i < days.length; i++) {
        let entity = {              
            id: getRandomId(),
            activity: activity,
            day: days[i],
            hours: hours,
            minutes: minutes,
            ampm: ampm
        }
        reminderState = reminderState.concat(entity)        
        schedule(entity)
    }
    localStorage.setItem('reminderState', JSON.stringify(reminderState))     
    render()                                                
    reminderList.listview().listview('refresh');            
}

const schedule = (entity) => {
    //it triggers notification schedule
    entity.notification = setTimeout(() => {
        Notification.requestPermission(function (result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
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





const findClosestSchedule = (reminder) => {
    let currentDate = new Date()
    let currentDay = currentDate.getDay()
    let reminderDay = DAY_OF_WEEKS[reminder.day]
    let diffDay = reminderDay - currentDay >= 0 ? reminderDay - currentDay : 7 + (reminderDay - currentDay)
    let reminderHours = reminder.ampm === 'PM' ? reminder.hours % 12 + 12 : reminder.hours;
    if (diffDay === 0) {
        let assumedAlertTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            reminderHours,
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
            reminderHours,
            reminder.minutes
        )
        return assumedAlertTime - currentDate
    }
}


const reschedule = (entity) => {
    let interval = 1000 * 60 * 60 * 24 * 7
    console.log(interval)
    entity.notification = setTimeout(() => {
        Notification.requestPermission(function (result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
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



const editItem = (id, activity, day, hours, minutes, ampm) => {
    reminderState = reminderState.map(item => {
            if (item.id === id) {
                item.activity = activity
                item.day = day
                item.hours = hours
                item.minutes = minutes
                item.ampm = ampm
                clearTimeout(item.notification)     
                item.notification = schedule(item)
            }
            return item
        }
    )
    localStorage.setItem('reminderState', JSON.stringify(reminderState))   
    render()                            
    reminderList.listview().listview('refresh');  
}



const deleteItem = (id) => {
    let itemToDelete = reminderState.find(item => item.id === id)
    clearTimeout(itemToDelete.notification)                         
    reminderState = reminderState.filter(item => item.id !== id)
    localStorage.setItem('reminderState', JSON.stringify(reminderState))        
    render()                                                                    
    reminderList.listview('refresh')                                            
}

addForm.submit(ev => {
    ev.preventDefault()
    let form = ev.target
    let activity = form['activity'].value
    let days = Array.from(form.querySelectorAll("input[type='checkbox']"))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
    let hours = +form['hours'].value % 12
    let minutes = +form['minutes'].value
    let ampm = form['add-zone'].value
    addItems(activity, days, hours, minutes, ampm)
})


editForm.submit(ev => {
    ev.preventDefault()
    let form = ev.target
    let id = form['id'].value
    let activity = form['edit-activity'].value
    let day = Array.from(form.querySelectorAll("input[name='edit-day']"))
        .filter(radio => radio.checked)
        .map(radio => radio.value)
    let hours = +form['edit-hours'].value % 12
    let minutes = +form['edit-minutes'].value
    let ampm = form['edit-zone'].value
    editItem(+id, activity, day, hours, minutes, ampm)
})


buttonAdd.click(() => {
    try {
        Promise.resolve(Notification.requestPermission())
            .then(function (permission) {
            })
    } catch (e) {
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
    } catch (e) {
        console.log(e)
    }
    editForm.submit()
})


handleEdit = (id) => {
    let reminder = reminderState.find(item => item.id === id)
    editId.val(reminder.id) 

    $('input:radio[name=edit-activity]').each(function () {
        $(this).prop('checked', false);
        $(this).checkboxradio().checkboxradio("refresh")
    });
    let element = $("input[name=edit-activity][value=" + reminder.activity + "]")
    element.prop('checked', true);
    element.checkboxradio().checkboxradio("refresh")

    $('input:radio[name=edit-day]').each(function () {
        $(this).prop('checked', false);
        $(this).checkboxradio().checkboxradio("refresh")
    });
    let dayElement = $("input[name=edit-day][value=" + reminder.day + "]")
    dayElement.prop('checked', true);
    dayElement.checkboxradio().checkboxradio("refresh")

    editHours.val(formatTime(reminder.hours))           
    editMinutes.val(formatTime(reminder.minutes))
    editZone.val(reminder.ampm).attr('selected', true).siblings('option').removeAttr('selected');
}


//this one is html representation of whole list
const reminderListComponent = (reminderState) => {
    let list = reminderState.map(item => `<li>${reminderListItem(item)}</li>`).join('')
    return `${list}`
}


const reminderListItem = (itemProps) => {
    return `
        <h1>${itemProps.activity}</h1>
        <p>${itemProps.day}</p>
        <p class='ui-listview-item-aside'>
            <strong>${formatTime(itemProps.hours)}:${formatTime(itemProps.minutes)} ${itemProps.ampm}</strong>
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

const formatTime = (timeUnit) => {
    let stringTimeUnit = timeUnit.toString()
    if (stringTimeUnit.length === 1) {
        return `0${timeUnit}`
    }
    return stringTimeUnit
}

const getRandomId = () => {
    return Math.floor(Math.random() * 100000000)
}

const render = () => {
    reminderList.html(reminderListComponent(reminderState))
}


let savedItems = localStorage.getItem('reminderState')

if (savedItems) {
    reminderState = JSON.parse(savedItems)
    reminderState.forEach(item => schedule(item))
} else {
    reminderState = []
}


render()

