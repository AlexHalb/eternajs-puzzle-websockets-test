import { server as WebSocketServer, connection, request, IMessage } from 'websocket';
import http from 'http';

export default class Server {
  server: http.Server;

  wsServer: WebSocketServer;

  constructor() {
    this.server = http.createServer((request, response) => {
      this.log('RECEIVED REQUEST', 'FOR', request.url)
      response.writeHead(404);
      response.end();
    });
    this.server.listen(8080, () =>  this.log('LISTEN', 'on port 8080'));
    this.wsServer = new WebSocketServer({
      httpServer: this.server,
      autoAcceptConnections: false,
    })
    this.wsServer.on('request', (req) => this.onRequest(req))
  }

 async onRequest(request: request) {
    if (this.originAllowed(request.origin)) {
      // request.reject();
      this.log('REJECT ORIGIN', request.origin);
      // return;
    }
    let connection = request.accept('echo-protocol', request.origin);
    this.log('ACCEPT CONNECTION');
    connection.on("message", (data: IMessage) => this.onMessage(data, connection));
    connection.on('close', (code, desc) => this.log('CLOSE', code, desc));
  }

  async onMessage(message: IMessage, conn: connection) {
    const msg = message.utf8Data;
    const idx = msg.indexOf('::');
    const user = msg.slice(0, idx);
    const text = msg.slice(idx + 2);
    if (text === 'PING') this.sendMessage('PONG', conn);
    this.log('RECEIVE', text, 'FROM', user)
  }

  async sendMessage(message: string, to: connection) {
    this.log('SEND', message);
    to.send(message);
  }

  async originAllowed(origin: string) {
    return true;
  }

  async error(err: Error) {
    console.error('[SERVER]', err);
  }

  async log(type: string, ...messages: string[] | any[]) {
    console.log('[SERVER]', type, ...messages);
  }
}