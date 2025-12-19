import { get } from "http"
import path from "path"

  type NodeItem = {
    id: string
    pos_x: string
    pos_y: string
    floor_id: string
    distFromStart?: number
    backwardsNode?: NodeItem
  }

  type EdgeItem = {
    id: string
    start: string
    end: string
    weight: number
  }

  export type Graph = {
    nodeList: NodeItem[]
    edgeList: EdgeItem[]
  }

export async function getNodes(dbCall: string): Promise<NodeItem[] | undefined>{
  
  // get Nodes

  try {
      const nodeRow = await (window as any).electron.ipcRenderer.invoke(dbCall)

      if (!Array.isArray(nodeRow)) return

      try {
        (nodeRow as any[]).forEach((r: any, idx: number)=> {
          console.log(`row ${idx}`, r.node_id, r.pos_x, r.pos_y, r.f_floor_id)
        })
      } catch (err) {
        console.log("Failed to log nodes", err)
      }

      const mappedNodes: NodeItem[] = nodeRow
        .map((r: any) => {
          return {
            id: r.node_id || '',
            pos_x: r.pos_x || '',
            pos_y: r.pos_y || '',
            floor_id: r.f_floor_id || '',
            distFromStart: undefined,
            backwardsNode: undefined

          }
        })
        console.log("id: ", mappedNodes[0].id,"X: ", mappedNodes[0].pos_x,"Y: ", mappedNodes[0].pos_y)

    return mappedNodes
  }
  catch (err) {
    console.error('Failed to load Nodes.\n', err)
    return
  }

}

export async function getEdges(dbCall: string): Promise<EdgeItem[] | undefined> {

  try {

    const edgeRow = await (window as any).electron.ipcRenderer.invoke(dbCall)

    if (!Array.isArray(edgeRow)) return

      try {
        (edgeRow as any[]).forEach((r: any, idx: number) => {
          console.log(`row ${idx} ${r.edge_id} ${r.f_start_node} ${r.f_end_node} ${r.weight}`)
        })
      } catch (err) {
        console.log("Failed to log edges", err)
      }

      const mappedEdges: EdgeItem[] = edgeRow
        .map((r: any) => {
          return {
              id: r.edge_id,
              start: r.f_start_node,
              end: r.f_end_node,
              weight: r.weight
          }
        })
        console.log('id: ', mappedEdges[0].id, 'start node: ', mappedEdges[0].start, 'end node: ', mappedEdges[0].end, 'weight: ', mappedEdges[0].weight)

    return mappedEdges

  } catch (err) {
    console.error('Failed to load Edges.\n', err)
    return
  }
}

async function getGraph(): Promise<Graph>{
  var graph: Graph = { nodeList: [], edgeList: [] };
  try {
    const nodes = await getNodes('db/getNodes')
    if (nodes) graph.nodeList = nodes
  } catch (err) {console.log("Couldn't get list of Nodes from DB")}
  try {
    const edges = await getEdges('db/getEdges')
    if (edges) graph.edgeList = edges
  } catch (err) {console.log("Couldn't get list of Edges from DB")}

  return graph
}

function findNeighbors(graph: Graph, node: NodeItem): NodeItem[]{
  var neighbors: NodeItem[] = []

  const getNodesById = (id: string): NodeItem | undefined => {
    return graph.nodeList?.find(n => n.id == id)
  }
  
  graph.edgeList?.forEach((e: EdgeItem) => {
      if (e.end === node.id) {
        const n = getNodesById(e.start)
        if (n) neighbors.push(n)
      }  else if(e.start === node.id) {
        const n = getNodesById(e.end)
        if (n) neighbors.push(n)
      }
    }
  )
  
  return neighbors
}

function findNearestNode(toProcess: NodeItem[]): NodeItem{

  var nearestNode: any = toProcess[0]

  toProcess.forEach((n: any) => {
    if (n.distFromStart < nearestNode.distFromStart){
      nearestNode = n
    }
  })
  return nearestNode
}

// get map of unique edges between currentNode and all neighbors with neighbor.id as key
export function findAllEdgesFromNode(graph: any, node: NodeItem, neighbors: NodeItem[]): Map <string, EdgeItem> {
  var neighborEdges = new Map <string, EdgeItem>()

  graph.edgeList?.forEach((e: any) => {
    if ((e.start == node.id) && neighbors.find(n => n.id == e.end)) {
        neighborEdges.set(e.end, e)
    }

    else if (e.end == node.id && neighbors.find(n => n.id == e.start)) {
        neighborEdges.set(e.start, e)
    }
  })
  
  return neighborEdges
}

export async function findRoomNode(roomId: string): Promise<string | null>{ 
  try {
    const roomNodeRow = await (window as any).electron.ipcRenderer.invoke('db/getNodeIdFromRoom', String(roomId))
    const nodeId = roomNodeRow && roomNodeRow.node_id ? String(roomNodeRow.node_id).trim() : null
    return nodeId
  } catch (err) {
    console.log("Failed to get room node id", err)
    return null
  }
}

export default async function findPath(pathStart: string, pathEndRoom: string): Promise<NodeItem[]>{

  var toProcess: NodeItem[] = []
  var path: NodeItem[] = []
  var pathLength: number = 0
  var currentNode: NodeItem
  var neighbors: NodeItem[] = []
  var graph: Graph = await getGraph()

  console.log("Finding path from Node: ", pathStart, " to Room: ", pathEndRoom)
  const pathEndNodeId = await findRoomNode(pathEndRoom)

  const startNode = graph.nodeList.find(n => String(n.id) === pathStart)
  const endNode = graph.nodeList.find(n => n.id == pathEndNodeId)
  if (!startNode || !endNode) {
    console.log('Missing start/end node', { startNodeExists: !!startNode, endNodeExists: !!endNode})
    return []
  }
  console.log("found end node: ", endNode.id)

  // initialize distances on start
  startNode.distFromStart = 0
  toProcess.push(startNode)

  while (toProcess.length > 0) {
    currentNode = findNearestNode(toProcess)
    const idx = toProcess.indexOf(currentNode);
    if (!(idx == -1)) toProcess.splice(idx, 1)
      else console.error("Node has invalid index of -1 in toProcess array")
    neighbors = findNeighbors(graph, currentNode)

    const neighborEdges: Map<string, EdgeItem> = findAllEdgesFromNode(graph, currentNode, neighbors)
    
    neighbors.forEach((nb: any) => {

      const weight = neighborEdges.get(nb.id)?.weight
      // use ! because weight must exist if neighbor is found
      const newDistFromStart = currentNode.distFromStart! + weight!
      if (nb.distFromStart == undefined) {
        toProcess.push(nb)
        nb.distFromStart = newDistFromStart
        nb.backwardsNode = currentNode
      } else if (toProcess.find(n => n.id == nb.id)) {
        if (nb.distFromStart > newDistFromStart) {
          nb.distFromStart = newDistFromStart
          nb.backwardsNode = currentNode
        }
      }
    })
  }

  pathLength = endNode.distFromStart!
  if (pathLength === undefined)  {
    console.log("No path found for selected room.")
  } else {
  console.log("Path length: ", pathLength)}

  // path from endNode using backwardsNode
  var knoten: NodeItem | undefined = endNode
  path.push(knoten)
  while (knoten && knoten.id !== startNode.id && knoten.backwardsNode !== undefined) {
    path.push(knoten.backwardsNode!)
    knoten = knoten.backwardsNode
  }
  try {console.log("Path from: " + path[path.length -1].id + " to: " + path[0].id)
    console.log("Full path: ", path)
  }
  catch(err){console.log("Failed to log path", err)}

  return path
}