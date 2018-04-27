import React from 'react';

const Colors = ["yellow","orange","red","pink","purple","blue","cyan","teal","green","grey"]
const MillisecsPerDay = 1000 * 60 * 60 * 24;

function dateDiff(d1,d2){
	return Math.floor( (d2 - d1)/(MillisecsPerDay) ) ;
}

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

export class TimelineContainer extends React.Component {
	render() {

		// Deal with the items and their order
		var Items = JSON.parse(JSON.stringify(this.props.itemsArray))
		var ReverseItems = JSON.parse(JSON.stringify(this.props.itemsArray))
		Items.sort(dynamicSort("start"))
		ReverseItems.sort(dynamicSort("-end"))
		const firstDate = Items[0].start
		const lastDate = ReverseItems[0].end

		// Deal with the Zoom level
		var zoom = this.props.zoom
		var colWidth = zoom * 30

		// Calculate timeline header labels
		const charsPerLabel = 6 // ex. "Dec 31".length
		// var numCols = dateDiff(Date.parse(firstDate), Date.parse(lastDate))
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
						(date, idx) => <TimelineLabel date={date} key={idx} index={idx} columns={colsPerLabel}></TimelineLabel>
					)
				}{
					Items.map(
						(item, idx) =>  <TimelineEvent item={item} key={idx} index={idx} firstDate={firstDate} colWidth={colWidth}></TimelineEvent>
					)
				}
			</div>
		)
	}
}

class TimelineEvent extends React.Component {
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

		var thisColor = Colors[this.props.index % Colors.length]

		// Regular
		if (textLengthInColumns <= eventSpanInDays) {
			let itemStyle = {
				fontSize: fontSize,
				gridColumnStart: startDayNumber,
				gridColumnEnd: startDayNumber + eventSpanInDays
			}

			return(
				<RegularTimelineElement color={thisColor} text={text} style={itemStyle}></RegularTimelineElement>
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
			}

			let textStyle = {
				gridColumnStart: eventSpanInDays + 1,
				gridColumnEnd: eventSpanInDays + textLengthInColumns + 2,
			}
			return (
				<LongTextTimelineElement color={thisColor} text={text} styles={[itemStyle, pillStyle, textStyle]}></LongTextTimelineElement>
			)
		}

		
	}
}

function TimelineLabel(props) {
	let LabelStyle = {
		gridColumnStart: props.index * props.columns + 1,
		gridColumnEnd: props.index * props.columns + props.columns + 1,
	}

	return(
		<div className="timeline-label" style={LabelStyle}>{props.date}</div>
	)
}

function RegularTimelineElement(props) {
console.log("class:", props.color)
return(
	<div className={`${props.color} lightest timeline-event timeline-event-regular`} style={props.style}>
		<span className={`${props.color} text-dark timeline-event-name`}>{String(props.text)}</span>
	</div>
)}

function LongTextTimelineElement(props) {

	return(
	<div className="timeline-event timeline-event-long-text" style={props.styles[0]}>
		<div className={`${props.color} lightest timeline-event-pill`} style={props.styles[1]}></div>
		<span className={`${props.color} text-normal timeline-event-name`} style={props.styles[2]}>{String(props.text)}</span>
	</div>

)}