/**
 * Haupt-Entrypoint für den Electron-Main-Prozess der Anwendung.
 *
 * Diese Datei initialisiert die Electron-App, erstellt das Hauptfenster,
 * registriert IPC-Handler für die Kommunikation mit dem Renderer und
 * verwaltet die Lebenszyklus-Ereignisse (Start, Aktivierung, Beenden).
 *
 * Features und Verantwortlichkeiten:
 * - Setzt die App User Model ID (Windows).
 * - Erstellt ein immer-oberes BrowserWindow mit vorkonfigurierten
 *   WebPreferences und behandelt das Öffnen externer Links.
 * - Lädt die Renderer-Oberfläche entweder von einer Entwicklungs-URL
 *   (HMR) oder aus der gebündelten index.html.
 * - Registriert IPC-Handler, die DB-Operationen kapseln und asynchron
 *   Ergebnisse an den Renderer zurückgeben:
 *     - db/searchRooms(prefix: string): Promise<string[]>
 *     - db/getNodes(): Promise<Node[]>
 *     - db/getEdges(): Promise<Edge[]>
 *     - db/getEvents(): Promise<Event[]>
 *     - db/getNodeIdFromRoom(name: string): Promise<number | null>
 *     - db/getNodeById(node_id: number): Promise<Node | null>
 *   (Die konkreten Typen von Node/Edge/Event werden in ./db definiert.)
 * - Sorgt für sauberes Schließen des DB-Connection-Pools beim Beenden,
 *   sowohl bei normalem App-Exit als auch bei SIGINT/SIGTERM (z. B. Ctrl+C).
 * - Aktiviert Entwicklungs-Shortcuts über electron-toolkit/utils.
 *
 * Fehlerbehandlung:
 * - Fehler beim Registrieren der DB-IPC-Handler werden protokolliert,
 *   damit die App weiterhin starten kann, wenn z. B. eine Abhängigkeit
 *   fehlt.
 * - Fehler beim Schließen des DB-Pools werden geloggt, aber verhindern
 *   nicht den Beendigungsablauf.
 *
 * Designentscheidungen / Hinweise:
 * - Das DB-Modul wird statisch importiert, verwendet aber eine lazy
 *   Connection-Pool-Implementierung, sodass Verbindungen erst bei Bedarf
 *   geöffnet werden. Das ermöglicht, dass der Import selbst keine
 *   direkte Verbindung herstellt (nützlich für Bundling/HMR).
 * - Das Hauptfenster wird initial versteckt (show: false) und erst
 *   beim ready-to-show Event angezeigt, um visuelles Flackern zu vermeiden.
 * - mainWindow.setAlwaysOnTop(true, "normal") sorgt dafür, dass das Fenster
 *   standardmäßig über anderen Fenstern liegt; dies kann bei Bedarf entfernt
 *   oder konfigurierbar gemacht werden.
 *
 * Wichtige Funktionen (Kurzbeschreibung):
 *
 * @function createWindow
 * Erzeugt das BrowserWindow mit den gewählten Abmessungen, Icon (unter Linux),
 * Preload-Skript und weiteren Einstellungen. Behandelt:
 * - ready-to-show -> show()
 * - window.open -> externen Browser öffnen und das Öffnen innerhalb der App verhindern
 * - Laden der Renderer-URL (Dev) oder der lokalen index.html (Prod)
 *
 * @remarks
 * - Dieses Modul geht davon aus, dass bei Entwicklung die Umgebungsvariable
 *   ELECTRON_RENDERER_URL gesetzt ist (z. B. vom electron-vite Dev-Server).
 * - In Produktionsumgebungen wird die vorgerenderte HTML-Datei aus dem Bundle
 *   geladen (join(__dirname, '../renderer/index.html')).
 *
 * @example
 * // Keine direkte API-Aufrufe notwendig; der Electron-Prozess initialisiert
 * // sich selbst beim app.whenReady() Aufruf.
 *
 * @packageDocumentation
 */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { execFile, exec } from 'child_process'
// Load environment variables from .env in development / local runs
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
} catch (err) {
  // ignore if dotenv isn't available in production
}
import { join } from 'path'
import db from './db' // statically import the DB module so the bundler emits out/main/db.js
// db uses a lazy pool and won't open connections until queried.
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 2160/4,
    height: 3840/4,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setAlwaysOnTop(true, "normal");

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  ipcMain.on('tab-clicked', (_event, tabId) => {
    console.log(`Tab ${tabId} clicked`)
  })

  // Database IPC handlers (main process talks to DB)
  // NOTE: make sure to `npm install mysql2` in the project root.
  try {

      ipcMain.handle('db/searchRooms', async (_ev, prefix: string) => {
        console.log('IPC: db/searchRooms invoked', { prefix })
        return await db.searchRoomsByPrefix(prefix)
      })

      ipcMain.handle('db/getNodes', async (_ev) => {
        return await db.getNodes()
      }) 

      ipcMain.handle('db/getEdges', async (_ev) => {
        return await db.getEdges()
      })

      ipcMain.handle('db/getEvents', async (_ev) => {
        return await db.getEvents()
      })
      ipcMain.handle('db/getNodeIdFromRoom', async (_ev, name: string) => {
        return await db.getNodeIdFromRoom(name)
      })

      ipcMain.handle('db/getNodeById', async (_ev, node_id: number) => {
        return await db.getNodeById(node_id)
      })

      console.log('DB IPC handlers registered')
      
  } catch (err: any) {
      console.warn('DB handlers not registered (error):', err?.message ?? err)
  }

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Ensure we close the DB connection pool when the app is quitting so
// the database doesn't keep connections open and to make sure resources
// are released cleanly. This helps when restarting the app (or during
// development with HMR) so stale connections are closed.
app.on('before-quit', async () => {
  try {
    await db.closePool()
    console.log('DB pool closed')
  } catch (err: any) {
    console.warn('Error while closing DB pool:', err?.message ?? err)
  }
})

// In development or when running via node/electron directly, handle
// termination signals so the pool is closed on Ctrl+C / graceful stop.
process.on('SIGINT', async () => {
  try {
    await db.closePool()
  } catch (_) {
    // ignore
  }
  process.exit()
})

process.on('SIGTERM', async () => {
  try {
    await db.closePool()
  } catch (_) {
    // ignore
  }
  process.exit()
})
