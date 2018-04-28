import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
// Material UI
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import Snackbar from 'material-ui/Snackbar';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { TimelineContainer } from './components/Timeline.js'
import './style/timelineStyle.css';
// import timelineItems from './timelineItems';
const DataEndpoint = './timelineItems.json';

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function getFirstAndLastDates(itemsArray){
	if (itemsArray !== null){
		// Get the date of the first and last events
		var reverseItems = JSON.parse(JSON.stringify(itemsArray))
		itemsArray.sort(dynamicSort("start"))
		reverseItems.sort(dynamicSort("-end"))
		return [itemsArray[0].start, reverseItems[0].end]
	}
	else {
		return [0, 0]
	}
}

class Timeline extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleZoomChange = this.handleZoomChange.bind(this);
	    this.updateItem = this.updateItem.bind(this);
	    this.closeSnackbar = this.closeSnackbar.bind(this);
	    this.state = {
	    	zoom: 3,
	    	items: null,
	    	snackbar: false,
	    	snackMsg: ""
	    };
	  }

	componentDidMount() {
		axios.get(DataEndpoint)
			.then((response) =>
				this.setState({
					items: response.data
				})
			)
	}

	closeSnackbar() {
		this.setState({
			snackbar: false
		})
	}

	handleZoomChange(value) {
		this.setState({zoom: value});
	}

	updateItem (value, idx, attr) {
		// Dynamically update attribute `attr` of the event at index `idx` 
		// Currently only used for `name`, but can be extended to `start` and `end`
		let TMP_NewItem = JSON.parse(JSON.stringify(this.state.items[idx]))
		TMP_NewItem[attr] = value
		this.setState({
			items: [
				...this.state.items.slice(0,idx),
				TMP_NewItem,
				...this.state.items.slice(idx+1, this.state.items.length)
			]
		})

		// Make POST request
		// The API Endpoint isn't set up properly yet, so we'll always get an error
		axios.post(DataEndpoint, [this.state.items])
			.then((response) => {
					this.setState({
						snackbar: true,
						snackMsg: "Saved Changes 👍"
					})
				}
			).catch((err) => 
				{
					this.setState({
						snackbar: true,
						snackMsg: `Unable to save changes. 🤷`
					})
				}
			)
	}

	render(){
		if (this.state.items !== null) {
			const ExtremeDates = getFirstAndLastDates(this.state.items)
			return(
				<div className="timeline-app">
					<TimelineContainer 
						itemsArray={this.state.items} 
						firstDate={ExtremeDates[0]} 
						lastDate={ExtremeDates[1]} 
						zoom={this.state.zoom}
						updateItem={this.updateItem}
					/>
					<div className="slider-container">
						<label>Zoom</label>
						<Slider 
							className="zoom-slider" 
							defaultValue={this.state.zoom} 
							min={1} max={6} 
							onChange={this.handleZoomChange}
							handleStyle={
								[{backgroundColor: "#2879F4", borderColor: "#2879F4"}, 
								{backgroundColor: "#2879F4", boxShadow: "#FFE2D4"}]
							}
							trackStyle={
								[{backgroundColor: "#99C4FE"}, 
								{backgroundColor: "#CFDDFF"}]
							}
						/>
					</div>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.snackbar}
						autoHideDuration={2500}
						onClose={this.closeSnackbar}
						SnackbarContentProps={{
						'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">{this.state.snackMsg}</span>}
					/>
				</div>
			)
		} else {
			return (
				<div className="no-data">
					<CircularProgress />
				</div>
			)
		}
	}
}

const App = () => (
<div>
	<AppBar position="static" color="primary" style={{backgroundColor: "#2879F4"}}>
        <Toolbar>
          <Typography variant="title" color="inherit">
            Timeline
          </Typography>
        </Toolbar>
      </AppBar>

      <Timeline/>
</div>
);

render(<App />, document.getElementById('root'));
