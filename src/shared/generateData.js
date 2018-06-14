const jStat = require('jStat').jStat;
import IOTA from 'iota.lib.js';
import iotap from 'iotap';

export const GenerateSubTangle = () => {


	var iota = new IOTA({'host':'http://node.deviceproof.org','port':'14265'})

	
	/*
	iota.api.getNodeInfo(function(error,nodedata){
		console.log(nodedata);
	});
	*/


  jStat.exponential.sample(1.5);
  

  let nodes = [];
  

	nodes.push({name:0,time:0,});
	nodes.push({name:1,time:0.5,});
	
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
