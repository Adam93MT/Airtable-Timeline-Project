import React from 'react';
import { render } from 'react-dom';
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { TimelineContainer } from './components/Timeline.js'
import './style/timelineStyle.css';
import timelineItems from './timelineItems';

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

class Timeline extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleZoomChange = this.handleZoomChange.bind(this);
	    this.updateItem = this.updateItem.bind(this);
	    this.state = {
	    	zoom: 2,
	    	items: timelineItems
	    };
	  }

	handleZoomChange(value) {
		this.setState({zoom: value});
	}

	updateItem (value, idx, attr) {
		console.log(value, idx, this.state.items)
		let NewItems = JSON.parse(JSON.stringify(this.state.items))
		NewItems[idx][attr] = value

		this.setState({
			items: NewItems 
		})

		// THIS IS WHERE I'D MAKE AN AJAX CALL TO UPDATE THE ITEM
	}
	render(){

		// Get the date of the first and last events
		var Items = JSON.parse(JSON.stringify(this.state.items))
		var ReverseItems = JSON.parse(JSON.stringify(this.state.items))
		Items.sort(dynamicSort("start"))
		ReverseItems.sort(dynamicSort("-end"))
		const lastDate = ReverseItems[0].end
		const firstDate = Items[0].start

		return(
			<div className="timeline-app">
			<TimelineContainer 
				itemsArray={this.state.items} 
				firstDate={firstDate} 
				lastDate={lastDate} 
				zoom={this.state.zoom}
				updateItem={this.updateItem}
			/>
				<div className="slider-container">
					<label>Zoom</label>
					<Slider 
						className="zoom-slider" 
						defaultValue={this.state.zoom} 
						min={1} max={5} 
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
			</div>
		)
	}
}

const App = () => (
<div>
	<AppBar position="static" color="primary" style={{backgroundColor: "#2879F4"}}>
        <Toolbar>
          <Typography variant="title" color="inherit">
            Airtable Timeline
          </Typography>
        </Toolbar>
      </AppBar>

      <Timeline/>
</div>
);

render(<App />, document.getElementById('root'));
