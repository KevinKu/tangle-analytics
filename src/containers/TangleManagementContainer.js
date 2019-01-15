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

		let Nodes = [];
		
		Nodes.push({name:this.state.TangleRoot,height:0,nodeIndex:0,});

		let ID = setInterval(()=>{this.GetNextApprovees;},3000); 

		this.setState({nodes:Nodes,intervalID:ID,live:1,});

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
		clearInterval(this.state.intervalID);
		this.setState({nodes:[],links:[],TangleRoot:"",intervalID:0,live:0,});

	};

	GetNextApprovees(){
	
	
		
			
	};


	Test(e){
	


	console.log(this.state);


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
