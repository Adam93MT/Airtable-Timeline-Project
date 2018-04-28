import React from 'react';
import {TimelineEvent} from './TimelineEvent.js'

const MillisecsPerDay = 1000 * 60 * 60 * 24;

function TimelineLabel(props) {
	let LabelStyle = {
		gridColumnStart: props.index * props.columns + 1,
		gridColumnEnd: props.index * props.columns + props.columns + 1,
	}

	return(
		<div className="timeline-label" style={LabelStyle}>{props.date}</div>
	)
}

export class TimelineContainer extends React.Component {

	render() {
		
		const firstDate = this.props.firstDate
		const lastDate = this.props.lastDate
		var zoom = this.props.zoom
		var colWidth = zoom * 22
		const charsPerLabel = 6 // ex. "Dec 31".length
		var colsPerLabel = 1 * Math.ceil(4/zoom)
		var DateLabelsArray = []

		for (var d = Date.parse(firstDate) + MillisecsPerDay; d < Date.parse(lastDate); d += colsPerLabel * MillisecsPerDay ) {
			let dt = new Date(d)
			DateLabelsArray.push(dt.toString().substr(4,charsPerLabel))
		}

		// Dynamically set the column width based on the zoom level
		let containerStyle = {
			gridTemplateColumns: colWidth,
			gridAutoColumns: colWidth
		}

		return(
			<div className="timeline-container" style={containerStyle}>
				{
					DateLabelsArray.map(
						(date, index) => 
							<TimelineLabel 
								date={date} 
								key={index} 
								index={index} 
								columns={colsPerLabel}
							/>
					)
				}
				{
					this.props.itemsArray.map(
						(item, index) =>  
							<TimelineEvent 
								item={item} 
								key={index} 
								index={index} 
								firstDate={firstDate} 
								colWidth={colWidth} 
								updateItem={this.props.updateItem}
							/>
					)
				}
			</div>
		)
	}
}