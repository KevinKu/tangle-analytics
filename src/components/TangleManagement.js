import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	  container: {
		      display: 'flex',
		      flexWrap: 'wrap',
		    },
	  input: {
		      margin: theme.spacing.unit,
		    },
});



function TangleManagementComponent(e){

	return (<div>
		<form>
		<label>
		SubTangle : 
		<Input
	        placeholder="Transaction Hash"
	        inputProps={{
			          'aria-label': 'Description',
				        }}
		onChange={e.InputHash}
	      /></label>
		<input type="submit" value="Graph" onClick={e.GraphTangle} />
		</form>
		<Button onClick={e.Stop}>Stop</Button>
		<Button onClick={e.Carry}>Carry on</Button>
		<Button onClick={e.Clear}>Clear</Button>
		</div>);
}

TangleManagementComponent.propTypes = {
	InputHash : PropTypes.func,
	GraphTangle : PropTypes.func,
	Stop : PropTypes.func,
	Carry : PropTypes.func,
	Clear : PropTypes.func,
};


export default TangleManagementComponent;
