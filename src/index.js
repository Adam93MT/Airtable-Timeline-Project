import React from 'react';
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

import { TimelineContainer, TimelineEvent } from './components/Timeline.js'
import './style/timelineStyle.css';
import timelineItems from './timelineItems';

const App = () => (
<div>
	<h1>Airtable Timeline{'\u2728'}</h1>
	<TimelineContainer itemsArray={timelineItems} zoom="1" ></TimelineContainer>
</div>
);

render(<App />, document.getElementById('root'));
