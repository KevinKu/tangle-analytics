import React from 'react';
import PropTypes from 'prop-types';
import TangleManagementComponent from '../components/TangleManagement';
import IOTA from 'iota.lib.js';
import iotap from 'iotap';



class TangleManagementContainer extends React.Component{

	constructor(props) {
	
		super();

		this.state = {
			nodes:[],
			links:[],
			NodeHost:'',
			NodePort:0,
			requestServer:0,
			TangleRoot:"",
			intervalID:0,
			live:0,
			currentTransactionHash:"",
		};

	};

	InputNodeHost(e){
	
		this.setState({NodeHost : e.target.value});
	
	}

	InputNodePort(e){
	
		this.setState({NodePort : e.target.value});
	
	}

	SetNode(e){
	
		e.preventDefault();
		Node = iotap.create(new IOTA({
	    'host':this.state.NodeHost ,
	    'port':this.state.NodePort 
	}));
	
		this.setState({requestServer:Node});

	}

	InputTangleRoot(e){
	
		this.setState({TangleRoot : e.target.value});
	};

	GraphTangle(e){

		e.preventDefault();	

		let nodes = [];
		
		nodes.push({});

			};

	Carry(e){
	
		e.preventDefault();
		this.setState({live:1});
	
	};

	Stop(e){
	
		e.preventDefault();
		this.setState({live:0});
	
	};


	Clear(e){
	
		e.preventDefault();
		this.setState({nodes:[],links:[],currentTransactionHash:""});
		clearInterval(this.state.intervalID);

	};

	GetNextApprovees(){
	
	
		
			
	};


	Test(e){
	
	console.log(this.state.TangleRoot);

	console.log(this.state.requestServer.getNodeInfo());
	
	};

	render(){
	
	return(<div>
		
		<TangleManagementComponent

		InputNodeHost={this.InputNodeHost.bind(this)}
		
		InputNodePort={this.InputNodePort.bind(this)}

		SetNode={this.SetNode.bind(this)}

		InputTangleRoot={this.InputTangleRoot.bind(this)}	

		GraphTangle={this.GraphTangle.bind(this)}

		Carry={this.Carry.bind(this)}

		Stop={this.Stop.bind(this)}
	
		Clear={this.Clear.bind(this)}

		/>
		
		<button onClick={this.Test.bind(this)} >Test TangleManagementContainer</button>		

		</div>);
	
	};
	



}  



export default TangleManagementContainer;
