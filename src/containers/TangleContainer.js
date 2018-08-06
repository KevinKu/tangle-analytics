import React from 'react';
import PropTypes from 'prop-types';
import Tangle from '../components/Tangle';
import {connect} from 'react-redux';
import Tooltip from 'rc-tooltip';
import * as d3Force from 'd3-force';
import {scaleLinear} from 'd3-scale';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './radio-button.css';
import '../components/Tangle.css';
import IOTA from 'iota.lib.js';
import iotap from 'iotap';



const mapStateToProps = (state, ownProps) => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({});

const nodeRadiusMax = 25;
const nodeRadiusMin = 13;
const showLabelsMinimumRadius = 21;
const getNodeRadius = nodeCount => {
  const smallNodeCount = 20;
  const largeNodeCount = 100;

  if (nodeCount < smallNodeCount) {
    return nodeRadiusMax;
  }
  if (nodeCount > largeNodeCount) {
    return nodeRadiusMin;
  }
  const scale = scaleLinear().domain([smallNodeCount, largeNodeCount]);
  scale.range([nodeRadiusMax, nodeRadiusMin]);

  return scale(nodeCount);
};


const leftMargin = 10;
const rightMargin = 10;
const bottomMargin = 190;

const nodeCountMin = 1;
const nodeCountMax = 500;
const nodeCountDefault = 20;
const lambdaMin = 0.1;
const lambdaMax = 50;
const lambdaDefault = 1.5;
const alphaMin = 0;
const alphaMax = 5;
const alphaDefault = 0.5;
const getTips = ({nodes, links}) => {
	  const tips = nodes.filter(node =>
		      !links.some(link => link.target === node));

	  return new Set(tips);
};



class TangleContainer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      nodes: [],
      links: [],
      nodeCount: nodeCountDefault,
      lambda: lambdaDefault,
      alpha: alphaDefault,
      width: 900, // default values
      height: 300,
      nodeRadius: getNodeRadius(nodeCountDefault),
      rootTransactionHash:"",
      requestServer: iotap.create(new IOTA({
	    'host':'http://node.deviceproof.org' ,
	    'port':14265 
	})) ,
      subTangleTips:[],
      time:0,
      live:1,
      intervalID:0,
      current_transactionHash:"",
    };


	  
  }


	ShowTransactionHash(e){
	
	const node_index = Number(e.target.getAttribute("name"));


	this.setState({current_transactionHash:this.state.nodes[node_index].transactionHash,});

}


  GraphSubTangle() {
    	const nodeRadius = getNodeRadius(1);


	  let c_subTangleTips = [];
	  let c_nodes = [];
		  

	  c_nodes.push({name:'0',transactionHash:this.state.rootTransactionHash,nodeIndex:0,x:0,y:150,});

	  c_subTangleTips.push({name:'0',transactionHash:this.state.rootTransactionHash,nodeIndex:0,x:0,y:150,});



	let ID = setInterval(()=>{this.DrawNextApprovees();},3000); 

	this.setState({
			nodes: c_nodes,
			links: [],
			subTangleTips: c_subTangleTips,
			time: 0,
      			nodeRadius,
			intervalID: ID,
			live: 1,
    			}, );



      }


	DrawNextApprovees(){

		const nodeRadius = getNodeRadius(6);


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

			if(exist == 0){
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


	
	}





   getApprovedNodes(root) {
    if (!root) {
      return {nodes: new Set(), links: new Set()};
    }

    return getDescendants({
      nodes: this.state.nodes,
      links: this.state.links,
      root,
    });
  }
  getApprovingNodes(root) {
    if (!root) {
      return {nodes: new Set(), links: new Set()};
    }

    return getAncestors({
      nodes: this.state.nodes,
      links: this.state.links,
      root,
    });
  }





    render() {
    const {nodeCount,lambda,alpha, width, height} = this.state;
    const approved = this.getApprovedNodes(this.state.hoveredNode);
    const approving = this.getApprovingNodes(this.state.hoveredNode);

    return (
      <div> 
	    <form >
	            <label>

	              SubTangle:
	              <input type="text"   onChange={e => this.setState({rootTransactionHash: e.target.value})} />
	            </label>
	            <input type="submit" value="Graph" onClick={(e)=>{
		e.preventDefault();
		 this.GraphSubTangle();
		    }} />
	          </form>
			    <br></br>
	     <button onClick={(e) =>{ 
		     		     e.preventDefault();
		     		     this.setState({nodes:[],links:[],time:0,current_transactionHash:"",width:900,height:300});
	     			     
		     		     clearInterval(this.state.intervalID);
	     }}>clear</button>
	    <br></br>
	    <button onClick={(e)=>{this.setState({live:0});}}>stop</button>
	    <button onClick={(e)=>{this.setState({live:1});}}>carry on</button>
	    <br></br>
        <Tangle links={this.state.links} nodes={this.state.nodes}
          nodeCount={6}
          width={width}
          height={height}
          leftMargin={leftMargin}
          rightMargin={rightMargin}
          nodeRadius={this.state.nodeRadius}
	  mouseEntersNodeHandler={this.ShowTransactionHash.bind(this)}
          approvedNodes={approved.nodes}
          approvedLinks={approved.links}
          approvingNodes={approving.nodes}
          approvingLinks={approving.links}
          hoveredNode={this.state.hoveredNode}
          tips={getTips({
            nodes: this.state.nodes,
            links: this.state.links,
          })}
          showLabels={this.state.nodeRadius > showLabelsMinimumRadius ? true : false}
        />
	    <div>
	    <p>Transaction Hash :</p>
	    <p>{this.state.current_transactionHash}</p>
	    </div>
      </div>
    );
  }
}

const TangleContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(TangleContainer);

export default TangleContainerConnected;
