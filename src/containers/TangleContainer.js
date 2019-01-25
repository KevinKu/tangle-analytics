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


const leftMargin = 10;
const rightMargin = 10;
const bottomMargin = 190;



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
      width: 900, 
      height: 300,
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
          nodeRadius={25}
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
          showLabels={true}
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
