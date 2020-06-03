# My Backyard

This is a prototype app developed for the purpose of exploring the capabilities and limitations of Progressive Web App technology. It contains 5 features which are explained below alongside instructions for use. 

## Set up for development and testing (Python HTTP.Server)
Clone the repository to your desktop, open a command prompt, travel to the directory that contains index.html and type:

py -m http.server 1337

then open a browser and go to the address 127.0.0.1:1337

## Downloading the Web App
First go to the home page: https://c-j-1.github.io/my_backyard/

To download the Web App, there are different methods based on different browsers or devices. The ability to download the app will not be available if it has already been been downloaded. Uninstall the app to regain the ability to download it.

If you are using Chromium based browsers (Chrome, Brave, Edge Chromium) on a Windows computer there will be a small (+) sign on the right hand side of the URL bar when you are on the home page. By clicking on this you will be given an option to download the Web App to your desktop, or cancel.

If you're using an Android device, an "Add to home screen" dialog box will pop up on the home page and you can choose to download it or cancel.

If you're using an iOS device (Safari Browser), press the share button at the top of the browser bar while on the home page, then click on "add to home screen". This method is limited, as downloading the app to the homescreen will only allow you to open it in a browser, not as it's own seperate web app.

The ability to download the app on a linux device running Ubuntu using Firefox Quantum v68.0.1 has been tested and is currently unavailable.

## Information and Instructions
There are 5 major features in this app, each can be accessed via a button on the home screen:
- Weather
- Wildlife
- Flowers
- Reminders
- Shopping

#### Weather

This is a Weather forecast feature. When you open the feature for the first time, you will be prompted to allow location services to access your location data so the app can serve you your weather forecast. To search for a specific city's weather forecast type it in the searchbar and confirm. The results show the weather forecast for the current day as well as the next 5 days. Information in the results include the temperature in celcius, min and max  temperatures, humidity, wind and rain.

#### Wildlife

This feature is unfinished. It was intended to be used as a video gallery in which users could upload, store and access videos with the help of an external data storage service such as google cloud storage. As of the project handover date, the user is able to record a video and play it back.

#### Flowers

This feature is an image recognition feature intended to be used in people's gardens to determine the species of a flower in an image file. It takes advantage of Microsoft Azure's image recognition service and it's API. to use:
1. Click the upload button and choose an image of a flower, or take an image using the camera option in the file chooser dialogue.
2. Wait for the success notification (usually around 1 second)
3. An image is displayed on the screen with an overlay containing the 5 top results from the image recognition service (top 5 results are based on object tags with the highest level of confidence).

#### Reminders

This feature allows users to recieve push notifications alerting them to either water or weed their garden. 
- To add a reminder, click the button in the top right labeled "Add Reminder". Choose which days you would like the reminder to notify you, choose the type of reminder (watering or weeding). Finally choose the time that reminder is to be pushed to your devices notification feature. Multiple reminders can be added.
- To remove a reminder press the small "x" button on the reminder.
- To edit a reminder press the small icon that resembles a pencil on the reminder.

#### Shopping

This is a list feature. Items can be created and put into lists of different categories, or removed from the lists. This is intended to be used as a shopping list but can be used to categorise any text into lists. To create a new item, first create the category which describes the item by pressing the category button and entering the text you want. To add an item to that category, press the item button, choose the category, then enter the name of the item  (e.g. Add a category named "Food", then add an item to the "Food" list named "Bread" ). Delete categories or items by clicking the icon resembling a pencil next to the item or category. Deleting a category will also delete any items inside it. Deleting an item will not delete the category.
