import React from 'react';

const Colors = ["yellow","orange","red","pink","purple","blue","cyan","teal","green","grey"]
const MillisecsPerDay = 1000 * 60 * 60 * 24;

function dateDiff(d1,d2){
	return Math.floor( (d2 - d1)/(MillisecsPerDay) ) ;
}

export class TimelineEvent extends React.Component {

	constructor() {
		super();
		this.state = {
			editingText: false,
		}
		this.toggleEditingText = this.toggleEditingText.bind(this);
		this.handleKeyStroke = this.handleKeyStroke.bind(this);
	}	

	toggleEditingText() {
		this.setState({
			editingText: !this.state.editingText
		})
	}

	handleKeyStroke(event){
		// enter/return
		if (event.keyCode === 13) {
			this.props.updateItem(event.target.value, this.props.index, "name")
			this.toggleEditingText()
		} 
		// esc
		else if (event.keyCode === 27) {
			this.toggleEditingText()
		}
	}

	render() {	
		const fontSize = 14 // we set the font size here since we need it to approximate the text length
		let text = this.props.item.name
		let firstDate = Date.parse(this.props.firstDate)
		let startDate = Date.parse(this.props.item.start)
		let endDate = Date.parse(this.props.item.end)
		let colWidth = this.props.colWidth
		let eventSpanInDays = dateDiff(startDate, endDate) + 1 // How many days does this event span?
		let startDayNumber = dateDiff(firstDate, startDate) + 1 // On what day does the event start since the first event started?
		let textLengthInColumns = Math.ceil(text.length * (fontSize/1.33) / colWidth) // Approx. how long is the text?
		var thisColor = Colors[this.props.index % Colors.length]

		console.log(this.props.index, text, eventSpanInDays, textLengthInColumns)

		// Regular
		if (textLengthInColumns <= eventSpanInDays) {
			let itemStyle = {
				fontSize: fontSize,
				gridColumnStart: startDayNumber,
				gridColumnEnd: startDayNumber + eventSpanInDays
			}
			return(
				<RegularTimelineElement 
					color={thisColor} 
					text={text} 
					style={itemStyle} 
					index={this.props.index}
					updateItem={this.props.updateItem}
				/>
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
				<LongTextTimelineElement 
					color={thisColor} 
					text={text} 
					styles={[itemStyle, pillStyle, textStyle]}
					index={this.props.index}
					updateItem={this.props.updateItem} 
				/>
			)
		}
	}
}

class RegularTimelineElement extends TimelineEvent {
	render() {
		let innerContent = ""
		if (this.state.editingText) {
			innerContent = (
				<input 
					autoFocus={true}
					type="text"
					className={`${this.props.color} text-dark timeline-event-name`} 
					defaultValue={this.props.text}
					onKeyDown={this.handleKeyStroke}
					onBlur={this.toggleEditingText}
				/>
			)
		} else {
			innerContent = (
				<span 
					className={`${this.props.color} text-dark timeline-event-name`} 
					onClick={this.toggleEditingText}>
						{String(this.props.text)}
				</span>
			)
		}

		return(
			<div className={`${this.props.color} lightest timeline-event timeline-event-regular`} id={`event-${this.props.index}`} style={this.props.style}>
				{innerContent}
			</div>
		)
	}
}

class LongTextTimelineElement extends RegularTimelineElement {
	render(){

		let innerContent = ""
		if (this.state.editingText) {
			innerContent = (
				<input 
					autoFocus={true}
					type="text"
					className={`${this.props.color} text-dark timeline-event-name`} 
					style={this.props.styles[2]} 
					defaultValue={this.props.text}
					onKeyDown={this.handleKeyStroke}
					onBlur={this.toggleEditingText}
				/>
			)
		} else {
			innerContent = (
				<span 
					className={`${this.props.color} text-normal timeline-event-name`} 
					style={this.props.styles[2]} 
					onClick={this.toggleEditingText}>
						{String(this.props.text)}
				</span>
			)
		}

		return(
			<div className="timeline-event timeline-event-long-text" id={`event-${this.props.index}`} style={this.props.styles[0]}>
				<div className={`${this.props.color} lightest timeline-event-pill`} style={this.props.styles[1]}></div>
				{innerContent}
			</div>

		)
	}
}