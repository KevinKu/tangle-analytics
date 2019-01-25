
let send = null
export default class Sender{

    static setReceiver(handler){
        send  = handler
    }

    static sendNodesAndLinks(Nodes,Links){
        send(Nodes,Links)
    }
}
