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

class Timeline extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleZoomChange = this.handleZoomChange.bind(this);
	    this.state = {zoom: 2};
	  }

	  handleZoomChange(value) {
	    this.setState({zoom: value});
	  }

	render(){

		return(
			<div className="timeline-app">
			<TimelineContainer itemsArray={this.props.itemsArray} zoom={this.state.zoom} ></TimelineContainer>
				<div className="slider-container">
					<label>Zoom: {this.state.zoom}</label>
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

      <Timeline itemsArray={timelineItems} />
</div>
);

render(<App />, document.getElementById('root'));
