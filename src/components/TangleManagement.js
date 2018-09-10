import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';


function TangleManagementComponent(pros){

	return (<div>
		<form>
		<label>
		SubTangle : 
		<Input
	        placeholder="Transaction Hash"
	        inputProps={{
			          'aria-label': 'Description',
				        }}
	      /></label>
		<input type="submit" value="Graph" />
		</form>
		<Button >Stop</Button>
		<Button >Carry on</Button>
		</div>);
}




export default TangleManagementComponent;
