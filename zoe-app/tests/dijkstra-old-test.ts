/* import { describe, it, expect, test } from 'vitest'
import { findAllEdgesFromNode } from '../src/renderer/src/scripts/dijkstra'
import findPath from '../src/renderer/src/scripts/dijkstra'

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

    describe('findPath', () => {
      it('finds shortest path in a simple chain a -> b -> c (with extra unrelated nodes)', async () => {
        const a: NodeItem = { id: 'a', pos_x: '', pos_y: '', floor_id: '' }
        const b: NodeItem = { id: 'b', pos_x: '', pos_y: '', floor_id: '' }
        const c: NodeItem = { id: 'c', pos_x: '', pos_y: '', floor_id: '' }

        // extra nodes that should not affect the path a -> b -> c
        const x: NodeItem = { id: 'x', pos_x: '', pos_y: '', floor_id: '' }
        const y: NodeItem = { id: 'y', pos_x: '', pos_y: '', floor_id: '' }

        const graph = {
          nodeList: [a, b, c, x, y],
          edgeList: [
            { id: 'e1', start: 'a', end: 'b', weight: 1 } as EdgeItem,
            { id: 'e2', start: 'b', end: 'c', weight: 1 } as EdgeItem,
            // extra edges among unrelated nodes
            { id: 'ex1', start: 'c', end: 'x', weight: 2 } as EdgeItem,
                        { id: 'ex1', start: 'x', end: 'y', weight: 2 } as EdgeItem,

          ],
        }

        const path = findPath(a, y)
        expect((await path).map(n => n.id)).toEqual(['y', 'x', 'c', 'b', 'a'])
      })

      it('chooses the lower weight route when multiple paths exist (with additional longer alternatives)', async () => {
        const a: NodeItem = { id: 'a', pos_x: '', pos_y: '', floor_id: '' }
        const b: NodeItem = { id: 'b', pos_x: '', pos_y: '', floor_id: '' }
        const c: NodeItem = { id: 'c', pos_x: '', pos_y: '', floor_id: '' }
        const d: NodeItem = { id: 'd', pos_x: '', pos_y: '', floor_id: '' }

        // add extras that shouldn't change the optimal route
        const e: NodeItem = { id: 'e', pos_x: '', pos_y: '', floor_id: '' }
        const f: NodeItem = { id: 'f', pos_x: '', pos_y: '', floor_id: '' }

        const graph = {
          nodeList: [a, b, c, d, e, f],
          edgeList: [
            { id: 'e1', start: 'a', end: 'b', weight: 1 } as EdgeItem,
            { id: 'e2', start: 'b', end: 'd', weight: 1 } as EdgeItem,
            { id: 'e3', start: 'a', end: 'c', weight: 5 } as EdgeItem,
            { id: 'e4', start: 'c', end: 'd', weight: 1 } as EdgeItem,
            // a direct but expensive edge a -> d that should not be chosen
            { id: 'e_direct', start: 'a', end: 'd', weight: 10 } as EdgeItem,
            // extra subgraph e <-> f
            { id: 'ef1', start: 'e', end: 'f', weight: 2 } as EdgeItem,
            { id: 'ef2', start: 'f', end: 'e', weight: 2 } as EdgeItem,
          ],
        }

        const path = findPath(a, d)
        expect((await path).map(n => n.id)).toEqual(['d', 'b', 'a'])
      })

      it('returns single-node path when start and end are the same instance (with other nodes present)', async () => {
        const a: NodeItem = { id: 'same', pos_x: '', pos_y: '', floor_id: '' }
        const other: NodeItem = { id: 'other', pos_x: '', pos_y: '', floor_id: '' }

        const graph = {
          nodeList: [a, other],
          edgeList: [
            { id: 'o1', start: 'other', end: 'other', weight: 1 } as EdgeItem,
          ] as EdgeItem[],
        }

        const path = findPath(a, a)
        expect((await path).map(n => n.id)).toEqual(['same'])
      })

      it('prefers the lower-weight parallel edge between the same nodes', async () => {
        const a: NodeItem = { id: 'a', pos_x: '', pos_y: '', floor_id: '' }
        const b: NodeItem = { id: 'b', pos_x: '', pos_y: '', floor_id: '' }
        const c: NodeItem = { id: 'c', pos_x: '', pos_y: '', floor_id: '' }

        const graph = {
          nodeList: [a, b, c],
          edgeList: [
            // two parallel edges a -> b with different weights
            { id: 'p1', start: 'a', end: 'b', weight: 5 } as EdgeItem,
            { id: 'p2', start: 'a', end: 'b', weight: 1 } as EdgeItem,
            { id: 'b1', start: 'b', end: 'c', weight: 1 } as EdgeItem,
          ],
        }

        const path = findPath(a, c)
        // should take the cheaper parallel edge p2 then b -> c
        expect((await path).map(n => n.id)).toEqual(['c', 'b', 'a'])
      })
    })
 */