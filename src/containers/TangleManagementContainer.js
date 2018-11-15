import React from 'react';
import PropTypes from 'prop-types';
import TangleManagementComponent from '../components/TangleManagement';



class TangleManagementContainer extends React.Component{

	constructor(props) {
	
	super();

	this.TangleRoot = "";
	this.intervalID = 0;

	};

	InputHash(){
	
	
	
	};

	GraphTangle(){
	
	
	
	};

	Carry(){
	
	
	
	};

	Stop(){
	
	
	
	};


	render(){
	
	return(<div>
		
		<TangleManagementComponent
		
		InputHash={this.InputHash}	

		GraphTangle={this.GraphTangle}

		Carry={this.Carry}

		Stop={this.Stop}
		
		/>

		</div>);
	
	};
	



}  



export default TangleManagementContainer;
