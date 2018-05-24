import React from 'react';
import PropTypes from 'prop-types';
import Tangle from '../components/Tangle';
import {connect} from 'react-redux';
import * as d3Force from 'd3-force';
import {scaleLinear} from 'd3-scale';
import {GenerateSubTangle} from '../shared/generateData';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './radio-button.css';
import '../components/Tangle.css';


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
      width: 300, // default values
      height: 300,
      nodeRadius: getNodeRadius(nodeCountDefault),
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.force = d3Force.forceSimulation();
    this.force.alphaDecay(0.1);

    this.force.on('tick', () => {
      this.force.nodes(this.state.nodes);

      // restrict nodes to window area
      for (let node of this.state.nodes) {
        node.y = Math.max(this.state.nodeRadius, Math.min(this.state.height - this.state.nodeRadius, node.y));
      }

      this.setState({
        links: this.state.links,
        nodes: this.state.nodes,
      });
    });
  }
  componentWillUnmount() {
    this.force.stop();
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  componentDidMount() {
    this.GraphSubTangle();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth - leftMargin - rightMargin,
      height: window.innerWidth < 768 ? window.innerHeight : window.innerHeight - bottomMargin,
    }, () => {
      this.recalculateFixedPositions();
      this.force
        .force('no_collision', d3Force.forceCollide().radius(this.state.nodeRadius * 2).strength(0.01).iterations(15))
        .force('pin_y_to_center', d3Force.forceY().y(d => this.state.height / 2).strength(0.1))
        .force('pin_x_to_time', d3Force.forceX().x(d => this.xFromTime(d.time)).strength(1))
        .force('link', d3Force.forceLink().links(this.state.links).strength(0.5).distance(this.state.nodeRadius*3)); // strength in [0,1]

      this.force.restart().alpha(1);
    });
  }



  GraphSubTangle(RootTransactionHash="") {
    const nodeRadius = getNodeRadius(6);
    const tangle = GenerateSubTangle({RootTransactionHash});

    const {width, height} = this.state;

    for (let node of tangle.nodes) {
      node.y = height/4 + Math.random()*(height/2),
      node.x = width/2; // required to avoid annoying errors
    }

    this.force.stop();

    this.setState({
      nodes: tangle.nodes,
      links: tangle.links,
      nodeRadius,
    }, () => {
      // Set all nodes' x by time value after state has been set
      this.recalculateFixedPositions();
    });

    this.force.restart().alpha(1);
  }
  recalculateFixedPositions() {
    // Set genesis's y to center
    const genesisNode = this.state.nodes[0];
    genesisNode.fx = this.setState.height / 2;

    for (let node of this.state.nodes) {
      node.fx = this.xFromTime(node.time);
    }
  }
  xFromTime(time) {
    const padding = this.state.nodeRadius;
    // Avoid edge cases with 0 or 1 nodes
    if (this.state.nodes.length < 2) {
      return padding;
    }

    const maxTime = this.state.nodes[this.state.nodes.length-1].time;

    // Rescale nodes' x to cover [margin, width-margin]
    const scale = scaleLinear().domain([0, maxTime]);
    scale.range([padding, this.state.width - padding]);

    return scale(time);
  }
  mouseEntersNodeHandler(e) {
    const name = e.target.getAttribute('name');
    this.setState({
      hoveredNode: this.state.nodes.find(node => node.name === name),
    });
  }
  mouseLeavesNodeHandler(e) {
    this.setState({
      hoveredNode: undefined,
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
	     <button onClick={(e) =>{ 
		     e.preventDefault();
		     this.GraphSubTangle();}}>try</button>
	    
	 <br></br>   
        <Tangle links={this.state.links} nodes={this.state.nodes}
          nodeCount={6}
          width={width}
          height={height}
          leftMargin={leftMargin}
          rightMargin={rightMargin}
          nodeRadius={this.state.nodeRadius}
	  mouseEntersNodeHandler={this.mouseLeavesNodeHandler.bind(this)}
          mouseLeavesNodeHandler={this.mouseLeavesNodeHandler.bind(this)}
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
      </div>
    );
  }
}

const TangleContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(TangleContainer);

export default TangleContainerConnected;
