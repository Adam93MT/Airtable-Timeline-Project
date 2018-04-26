import React, { Component } from 'react';

const Colors = ["#ffdaf6","#ffdce5", "#fee2d5", "#ffeab6", "#d1f7c4", "#d0f0fd", "#cfdfff", "#ede2fe", "#f0f0f0"]

function dateDiff(d1,d2){
	return Math.floor( (d2 - d1)/(1000 * 60 * 60 * 24) ) ;
}

export class TimelineContainer extends React.Component {
	render() {

		let numItems = this.props.itemsArray.length
		// TODO: Check to be sure this is true
		let firstDate = this.props.itemsArray[0].start // We assume the list is pre-sorted, and the first item is the first event
		
		var zoom = this.props.zoom
		var colWidth = zoom * 60

		// Dynamically set the column width based on the zoom level
		let containerStyle = {
			gridTemplateColumns: colWidth,
			gridAutoColumns: colWidth
		}

		return(
			<div className="timeline-container" style={containerStyle}>
				{
					this.props.itemsArray.map(
						(item, idx) =>  <TimelineEvent item={item} index={idx} firstDate={firstDate} colWidth={colWidth}></TimelineEvent>
					)
				}
			</div>
		)
	}
}

export class TimelineEvent extends React.Component {
	render() {
		const fontSize = 14 // we set the font size here since we need it to approximate the text length
		let firstDate = Date.parse(this.props.firstDate)
		let startDate = Date.parse(this.props.item.start)
		let endDate = Date.parse(this.props.item.end)
		let text = this.props.item.name
		let colWidth = this.props.colWidth

		let eventSpanInDays = dateDiff(startDate, endDate) + 1 // How many days does this event span?
		let startDayNumber = dateDiff(firstDate, startDate) + 1 // On what day does the event start since the first event started?

		let textLengthInColumns = Math.ceil(text.length * (fontSize/2) / colWidth) // Approx. how long is the text?
		console.log(this.props.index, text, eventSpanInDays, textLengthInColumns)

		let BGColor = Colors[this.props.index % Colors.length]

		// Regular
		if (textLengthInColumns <= eventSpanInDays) {
			let itemStyle = {
				fontSize: fontSize,
				gridColumnStart: startDayNumber,
				gridColumnEnd: startDayNumber + eventSpanInDays,
				backgroundColor: BGColor
			}

			return(
				<RegularTimelineElement text={text} style={itemStyle}></RegularTimelineElement>
			)
		}
		// Long Text
		else {
			let itemStyle = {
				fontSize: fontSize,
				gridColumnStart: startDayNumber,
				gridColumnEnd: startDayNumber + eventSpanInDays + textLengthInColumns,
				gridTemplateColumns: colWidth,
				gridAutoColumns: colWidth,
			}

			let pillStyle = {
				gridColumnStart: 1,
				gridColumnEnd: eventSpanInDays + 1,
				backgroundColor: BGColor
			}

			let textStyle = {
				gridColumnStart: eventSpanInDays + 1,
				gridColumnEnd: eventSpanInDays + textLengthInColumns + 1,
			}
			return (
				<LongTextTimelineElement text={text} styles={[itemStyle, pillStyle, textStyle]}></LongTextTimelineElement>
			)
		}

		
	}
}

function RegularTimelineElement(props) {
return(
	<div className="timeline-event-regular" style={props.style}>
		<span className="timeline-event-name">{String(props.text)}</span>
	</div>
)}

function LongTextTimelineElement(props) {

	return(
	<div className="timeline-event-long-text" style={props.styles[0]}>
		<div className="timeline-event-pill" style={props.styles[1]}></div>
		<span className="timeline-event-name" style={props.styles[2]}>{String(props.text)}</span>
	</div>

)}