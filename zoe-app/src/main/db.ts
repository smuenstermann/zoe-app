import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function getPool() {
  if (pool) return pool

  const DB_HOST = process.env.DB_HOST
  const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  const DB_USER = process.env.DB_USER
  const DB_PASSWORD = process.env.DB_PASSWORD
  const DB_NAME = process.env.DB_NAME

  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+01:00'  // set pool timezone to Berlin since db timestamps are stored in local time

  })
  return pool
}

export async function listRooms(limit = 500) {
  const p = getPool()
  const [rows] = await p.query('SELECT room_id, name, description, f_floor_id FROM t_rooms LIMIT ?',[limit])
  return rows as any[]
}

export async function getRoomByName(name: string) {
  const p = getPool()
  const [rows] = await p.query(`SELECT room_id, name, description, f_floor_id 
    FROM t_rooms 
    WHERE name = ? 
    LIMIT 1`,[name])
  const arr = rows as any[]
  return arr.length ? arr[0] : null
}

export async function getNodeIdFromRoom(name: string) {
  const p = getPool()
  const [rows] = await p.query(`SELECT node_id from t_nodes 
    join t_rooms on t_rooms.f_node_id = t_nodes.node_id
    WHERE t_rooms.name = ? 
    LIMIT 1`,[name])
  const arr = rows as any[]
  return arr.length ? arr[0] : null
}

export async function searchRoomsByPrefix(prefix: string, limit = 50) {
  const p = getPool()
  const like = `${prefix}%`
  const [rows] = await p.query(`SELECT room_id, name, f_floor_id 
    FROM t_rooms 
    WHERE name LIKE ? 
    LIMIT ?`, [like, limit])
  return rows as any[]
}

export async function getNodes() {
  const p = getPool()
  const [rows] = await p.query('SELECT node_id, pos_x, pos_y, f_floor_id, f_room_id FROM t_nodes')
  return rows as any[]
}

export async function getNodeById(node_id: number) {
  const p = getPool()
  const [rows] = await p.query(`SELECT node_id, pos_x, pos_y, f_floor_id, f_room_id 
    FROM t_nodes 
    WHERE node_id = ? LIMIT 1`, [node_id])
  const arr = rows as any[]
  return arr.length ? arr[0] : null
}

export async function getEdges() {
  const p = getPool()
  const [rows] = await p.query(`SELECT e.edge_id, e.f_start_node, e.f_end_node, e.weight
    FROM t_edges e
    JOIN t_nodes n ON n.node_id = e.f_start_node`)
  return rows as any[]
}

export async function getEvents(limit = 100) {
  const p = getPool()
  const [rows] = await p.query(
    `SELECT title, 
      t_events.description, 
      event_start, 
      event_end, 
      t_rooms.room_id, 
      t_rooms.name 
    FROM t_events 
    JOIN t_rooms ON t_rooms.room_id=t_events.f_room_id 
    WHERE event_end >= DATE(NOW())
    ORDER BY event_start ASC 
    LIMIT ?`, [limit])
  return rows as any[]
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export default { getPool, listRooms, getRoomByName, searchRoomsByPrefix, getNodes, getEdges, getEvents, getNodeIdFromRoom, getNodeById, closePool }
