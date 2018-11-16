import React from 'react';
import PropTypes from 'prop-types';
import TangleManagementComponent from '../components/TangleManagement';



class TangleManagementContainer extends React.Component{

	constructor(props) {
	
		super();

		this.state = {
			nodes:[],
			links:[],
			TangleRoot:"",
			intervalID:0,
			live:0,
			currentTransactionHash:"",
		};

	};

	InputHash(e){
	
		this.setState({TangleRoot : e.target.value});
	};

	GraphTangle(e){
		e.preventDefault();	
		const nodeRadius = 25;


	  	let c_TangleTips = [];
	  	let c_nodes = [];
		  

	  	c_nodes.push({name:'0',transactionHash:this.state.rootTransactionHash,nodeIndex:0,x:0,y:150,});

	  	c_TangleTips.push({name:'0',transactionHash:this.state.rootTransactionHash,nodeIndex:0,x:0,y:150,});



		let ID = setInterval(()=>{this.GetNextApprovees();},3000); 

		this.setState({
			nodes: c_nodes,
			links: [],
			TangleTips: c_TangleTips,
			time: 0,
      			nodeRadius,
			intervalID: ID,
			live: 1,
    			}, );	
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
	
	const nodeRadius = 25;


		let tangle = "";
		let c_subTangleTips = [];
	  	let c_nodes = this.state.nodes;
	  	let c_links = this.state.links;
	  	let c_time = this.state.time + 1;
		let s_node = this.state.requestServer;

		if(this.state.live == 0){
				return ;
			}
		

		if(this.state.subTangleTips.length > 0){

		
		for(let findTransaction of this.state.subTangleTips){


		 const approve_list = s_node.findTransactions({'approvees': [findTransaction.transactionHash]});

	Promise.all([approve_list]).then(([approve_list])=>{
	

		console.log(approve_list);

	  	if(approve_list.length > 0){	



		for(let a_transaction of approve_list){
		
			let exist = 0;
			
			for(let site of c_nodes){
				if(a_transaction == site.transactionHash){
					exist = 1;
				
				}
			}


			if(exist == 1){


			}
			else{
			let c_nodeIndex = c_nodes.length;
			let c_node_x = findTransaction.x + 500 + 250*Math.random();
			let c_node_y = findTransaction.y + (200 + approve_list.length*50)*(Math.random() - 0.5);

			c_nodes.push({name:c_nodeIndex.toString(),transactionHash:a_transaction,nodeIndex:c_nodeIndex,x:c_node_x,y:c_node_y,});
			c_subTangleTips.push({name:c_nodeIndex.toString(),transactionHash:a_transaction,nodeIndex:c_nodeIndex,x:c_node_x,y:c_node_y,});
			c_links.push({source:c_nodes[c_nodeIndex],target:c_nodes[findTransaction.nodeIndex]});


			
			}
			
	
			}

		}

	
	});

		}


			

			}





		tangle = {nodes:c_nodes,links:c_links};



    			this.setState({
      			nodes: tangle.nodes,
      			links: tangle.links,
			subTangleTips: c_subTangleTips,
      			nodeRadius,
    			});
	
	};

	render(){
	
	return(<div>
		
		<TangleManagementComponent
		
		InputHash={this.InputHash.bind(this)}	

		GraphTangle={this.GraphTangle.bind(this)}

		Carry={this.Carry.bind(this)}

		Stop={this.Stop.bind(this)}
	
		Clear={this.Clear.bind(this)}

		/>

		</div>);
	
	};
	



}  



export default TangleManagementContainer;
