const jStat = require('jStat').jStat;
var IOTA = require('../../node_modules/iota.lib.js');

export const GenerateSubTangle = ({RootTransactionHash}) => {


	var iota = new IOTA({'host':'http://node.deviceproof.org','port':'14265'})

	let nodeinfo="G";

	nodeinfo = iota.api.getNodeInfo(function getnodeinfo(error,nodeinfo)
		{
			if(nodeinfo)
				{
					return nodeinfo;
				}
		});


  jStat.exponential.sample(1.5);
  

  let nodes = [];
  

	nodes.push({name:'0',time:'0',});
	nodes.push({name:'1',time:'0.5',});
	nodes.push({name:'2',time:'1',});
	nodes.push({name:'3',time:'1.5',});
	nodes.push({name:'4',time:'2',});

/*

  while (nodes.length < nodeCount) {
    const delay = jStat.exponential.sample(lambda);
    time += delay;
    nodes.push({
      name: `${nodes.length}`,
      time,
      x: 300,
      y: 200,
    });
  }

*/


	
  const links = [];

	links.push({source: nodes[1], target: nodes[0]});
	links.push({source: nodes[2], target: nodes[0]});
	links.push({source: nodes[2], target: nodes[1]});
	links.push({source: nodes[3], target: nodes[2]});
	links.push({source: nodes[3], target: nodes[1]});
	links.push({source: nodes[4], target: nodes[3]});
	links.push({source: nodes[4], target: nodes[2]});


/*

  for (let node of nodes) {
    const candidates = nodes
      .filter(candidate => candidate.time < node.time - h);

    const candidateLinks = links
      .filter(link => link.source.time < node.time - h);

    const tips = tipSelectionAlgorithm({
      nodes: candidates,
      links: candidateLinks,
      alpha,
    });

    if (tips.length > 0) {
      links.push({source: node, target: tips[0]});
      if (tips.length > 1 && tips[0].name !== tips[1].name) {
        links.push({source: node, target: tips[1]});
      }
    }
  };

*/
	
  return {
    nodes,
    links,
  };
};
