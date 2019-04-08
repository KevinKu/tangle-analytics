import React from 'react';
import PropTypes from 'prop-types';
import TangleManagementComponent from '../components/TangleManagement';
import IOTA from 'iota.lib.js';
import iotap from 'iotap';
import Sender from '../sendNodesAndLinks'; 



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
		
		Nodes.push({name:this.state.TangleRoot,nodeIndex:0,x:0,y:150});

		let ID = setInterval(()=>{this.GetNextApprovees();},3000); 

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
		this.setState({nodes:[],links:[],intervalID:0,live:0,});

	};

	GetNextApprovees(){
	

		//If "stop" is clicked , don't search.

		if(this.state.live == 0){
			return;
		}

		//send nodes and links to TangleContainer
		
		Sender.sendNodesAndLinks(this.state.nodes,this.state.links);	

		let Nodes = this.state.nodes;
		let Links = this.state.links;

		for(let searchedTransaction of this.state.nodes){
		const approveList = this.state.requestServer.findTransactions({'approvees':[searchedTransaction.name]});

		Promise.all([approveList]).then(([approveList])=>{
		
			if(approveList.length > 0){
		
			//create link and add new node to this.state.nodes.
			for(let approveTransaction of approveList){
				let doesApproverExist = 0;
				let doesLinkExist = 0;
				let approverNodeIndex = 0;

				//check if approveTransaction is in Nodes. 

				for(let Node of Nodes){
				if(Node.name == approveTransaction){
					doesApproverExist = 1;
					approverNodeIndex = Node.nodeIndex;
				
					}
				}

				//check if link relation is in Links when node exists in Nodes.

				if(doesApproverExist == 1){
				
				for(let Link of Links){
				
					if(Link.source == Nodes[approverNodeIndex] && Link.target == searchedTransaction){
					
						doesLinkExist = 1;
					
					}
				
				}
				
				}
					
			// Node(approver) doesn't exist and Link doesn't exist.
			if(doesApproverExist == 0){
			
			let newApproverNodeIndex = Nodes.length;

			Nodes.push({name:approveTransaction,nodeIndex:newApproverNodeIndex,x:searchedTransaction.x + 500 + 250*Math.random(),y:searchedTransaction.y + (200 + approve_list.length*50)*(Math.random() - 0.5)});

			Links.push({source:Nodes[newApproverNodeIndex],target:searchedTransaction});
			
			}
			
			
			// Node(approver) exists and Link doesn't exist.			
			
			if(doesApproverExist == 1 && doesLinkExist == 0){
			
			Links.push({source:Nodes[approverNodeIndex],target:searchedTransaction});

			let anotherHeight = Nodes[approverNodeIndex].height - 1;
	
			}
			
			
			/*
			 Node(approver) exists and Link exists.
			 That means both were recorded,so do nothing.

			 Node(approver) doesn't exist and Link exists.
			 Impossible case.Don't deal with it.
			 
			  */
					}
			}
		
		});
		
		// put new nodes and links in state.
		
		this.setState({nodes:Nodes,links:Links});

		
		}
			
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
