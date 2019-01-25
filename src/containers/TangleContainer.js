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
import TangleManagementContainer from './TangleManagementContainer';
import Sender from '../sendNodesAndLinks'; 


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



const getAncestors = ({nodes, links, root}) => {
	  const stack = [root];
	  const visitedNodes = new Set();
	  const visitedLinks = new Set();

	  while (stack.length > 0) {
		      const current = stack.pop();

		      const incomingEdges = links.filter(l => l.target === current);
		      for (let link of incomingEdges) {
			            visitedLinks.add(link);
			            if (!visitedNodes.has(link.source)) {
					            stack.push(link.source);
					            visitedNodes.add(link.source);
					          }
			          }
		    }

	  return {nodes: visitedNodes, links: visitedLinks};
};



const getDescendants = ({nodes, links, root}) => {
	  const stack = [root];
	  const visitedNodes = new Set();
	  const visitedLinks = new Set();

	  while (stack.length > 0) {
		      const current = stack.pop();

		      const outgoingEdges = links.filter(l => l.source === current);
		      for (let link of outgoingEdges) {
			            visitedLinks.add(link);
			            if (!visitedNodes.has(link.target)) {
					            stack.push(link.target);
					            visitedNodes.add(link.target);
					          }
			          }
		    }

	  return {nodes: visitedNodes, links: visitedLinks};
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
      width: 900, 
      height: 300,
      nodeRadius: getNodeRadius(nodeCountDefault),
    };


	  
  }


	componentDidMount(){

        Sender.setReceiver(this.NodesAndLinksReceiver.bind(this));

    	}


	NodesAndLinksReceiver(Nodes,Links){
	
	this.setState({nodes:Nodes,links:Links});
	
	}
	

	ShowTransactionHash(e){
	
	const node_index = Number(e.target.getAttribute("name"));


	this.setState({current_transactionHash:this.state.nodes[node_index].transactionHash,});

}

	ShowReferrerAndApprover(e){
	
	 const name = e.target.getAttribute('name');
		    this.setState({
			          hoveredNode: this.state.nodes.find(node => node.name === name),
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
     <TangleManagementContainer />
	<br></br>


        <Tangle links={this.state.links} nodes={this.state.nodes}
          nodeCount={6}
          width={width}
          height={height}
          leftMargin={leftMargin}
          rightMargin={rightMargin}
          nodeRadius={this.state.nodeRadius}
	  mouseEntersNodeHandler={this.ShowReferrerAndApprover.bind(this)}
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
