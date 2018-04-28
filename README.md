# What you like about your implementation.

I really like the simplicity of the layout, and how only a few parameters need to be set in React to properly layout an event. If new events are added to the list, the grid will automatically place the new event in an appropriate spot.

I've made each event as "stateless" as possible, with the mutable data a state variable of the timeline container. The only "state" of each event is whether it is being edited or not.

I think that the use of colour is quite effective here, especially how it ties the "long text" events together visually

# What you would change if you were going to do it again.

Adding simple grid lines would be helpful aesthetically, however this is hard to pull off using the `CSS` grid layout without adding a new element to the DOM in every cell.
Additionally, highlighting _today_ might be a useful feature

The slider element I used (`rc-slider`) only works with integers. I would like to build (or find) another React component that will provide more continuous and less choppy zooming.

While I've implemented inline text editing, I haven't connected this to a backend that saves the data back to a file. Every time the page reloads, the data will refresh.

# How you made your design decisions. For example, if you looked at other timelines for inspiration, please note that.

Design decisions in terms of design language were primarily based off of existing Airtable designs, while the layout took hints from Asana's  timeline feature, and Instagantt, a gantt chart app that uses Asana's API

# How you would test this if you had more time.

Events should be unit tested using data that have extreme values (very long/short/empty text, very long time span), and the timeline as a whole should be tested using a large number of events. 


Since the data is loaded from a local file, there isn't a need for integration testing, however if instead we load and save data using GET/POST, this should be both unit tested using sample data, and integration tested with the server.

Additionally, there is no input validation for event naming, so once validation/sanitation is implemented, this should be tested with some potentially harmful strings.

