import { describe, it, expect, vi, afterEach } from 'vitest'

const modPath = '../src/renderer/src/scripts/dijkstra'

// Test-controlled containers used by the vi.mock factory
let mockedNodes: any[] = []
let mockedEdges: any[] = []

vi.mock('../src/renderer/src/scripts/dijkstra', async () => {
  const actual = await vi.importActual('../src/renderer/src/scripts/dijkstra')
  return {
    ...(actual as any),
    getNodes: async () => mockedNodes,
    getEdges: async () => mockedEdges,
  }
})

afterEach(() => {
  mockedNodes = []
  mockedEdges = []
  vi.restoreAllMocks()
  try { delete (globalThis as any).window } catch (_) { (globalThis as any).window = undefined }
})

describe('dijkstra utilities', () => {
  it('findAllEdgesFromNode returns correct mapping for a node', async () => {
    const actual = await vi.importActual(modPath) as any

    const graph = {
      nodeList: [
        { id: 'a', pos_x: '', pos_y: '', floor_id: '' },
        { id: 'b', pos_x: '', pos_y: '', floor_id: '' },
        { id: 'c', pos_x: '', pos_y: '', floor_id: '' },
      ],
      edgeList: [
        { id: 'e1', start: 'a', end: 'b', weight: 1 },
        { id: 'e2', start: 'b', end: 'c', weight: 2 },
        { id: 'e3', start: 'c', end: 'a', weight: 3 },
      ],
    }

    // neighbors of 'a' are b (edge e1) and c (edge e3)
    const neighbors = [graph.nodeList[1], graph.nodeList[2]]

    const map = actual.findAllEdgesFromNode(graph as any, graph.nodeList[0] as any, neighbors as any)

    expect(map.get('b')?.id).toBe('e1')
    expect(map.get('c')?.id).toBe('e3')
  })

  it('findPath gives shortest path on graph', async () => {
    const a = { id: 'a', pos_x: '', pos_y: '', floor_id: '' }
    const b = { id: 'b', pos_x: '', pos_y: '', floor_id: '' }
    const c = { id: 'c', pos_x: '', pos_y: '', floor_id: '' }
    const x = { id: 'x', pos_x: '', pos_y: '', floor_id: '' }
    const y = { id: 'y', pos_x: '', pos_y: '', floor_id: '' }

    // mock DB-returned node/edge rows
    mockedNodes = [
      { node_id: 'a', pos_x: '', pos_y: '', f_floor_id: '' },
      { node_id: 'b', pos_x: '', pos_y: '', f_floor_id: '' },
      { node_id: 'c', pos_x: '', pos_y: '', f_floor_id: '' },
      { node_id: 'x', pos_x: '', pos_y: '', f_floor_id: '' },
      { node_id: 'y', pos_x: '', pos_y: '', f_floor_id: '' },
    ]
    mockedEdges = [
      { edge_id: 'e1', f_start_node: 'a', f_end_node: 'b', weight: 1 },
      { edge_id: 'e2', f_start_node: 'b', f_end_node: 'c', weight: 1 },
      { edge_id: 'ex1', f_start_node: 'c', f_end_node: 'x', weight: 2 },
      { edge_id: 'ex2', f_start_node: 'x', f_end_node: 'y', weight: 2 },
    ]

    ;(globalThis as any).window = {
      electron: { ipcRenderer: { invoke: async (call: string) => {
        if (typeof call === 'string' && call.includes('getNodes')) return mockedNodes
        if (typeof call === 'string' && call.includes('getEdges')) return mockedEdges
        return []
      } } }
    }

    const dijkstra = await import(modPath)
    const path = await dijkstra.default(a, y)
    expect(path.map((n: any) => n.id)).toEqual(['y', 'x', 'c', 'b', 'a'])
  })

  it('findPath selects cheaper edges', async () => {
    const a = { id: 'a', pos_x: '', pos_y: '', floor_id: '' }
    const b = { id: 'b', pos_x: '', pos_y: '', floor_id: '' }
    const c = { id: 'c', pos_x: '', pos_y: '', floor_id: '' }

    mockedNodes = [
      { node_id: 'a', pos_x: '', pos_y: '', f_floor_id: '' },
      { node_id: 'b', pos_x: '', pos_y: '', f_floor_id: '' },
      { node_id: 'c', pos_x: '', pos_y: '', f_floor_id: '' },
    ]
    mockedEdges = [
      { edge_id: 'p1', f_start_node: 'a', f_end_node: 'b', weight: 5 },
      { edge_id: 'p2', f_start_node: 'a', f_end_node: 'b', weight: 1 },
      { edge_id: 'b1', f_start_node: 'b', f_end_node: 'c', weight: 1 },
    ]

    ;(globalThis as any).window = {
      electron: { ipcRenderer: { invoke: async (call: string) => {
        if (typeof call === 'string' && call.includes('getNodes')) return mockedNodes
        if (typeof call === 'string' && call.includes('getEdges')) return mockedEdges
        return []
      } } }
    }

    const dijkstra = await import(modPath)
    const path = await dijkstra.default(a, c)
    expect(path.map((n: any) => n.id)).toEqual(['c', 'b', 'a'])
  })
})
