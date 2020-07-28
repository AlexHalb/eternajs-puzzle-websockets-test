import { client as WebSocketClient, IMessageEvent, IMessage, connection } from 'websocket';


export default class Client {
  client = new WebSocketClient()

  connection : connection;

  name: string

  constructor(name: string) {
    this.name = name;
    this.client.on('connectFailed', (err) => this.error(err));
    this.client.on('connect', (conn) => this.connect(conn));
    this.client.connect('ws://localhost:8080', 'echo-protocol')
  }

  async connect(connection: connection) {
    this.connection = connection;
    connection.on('error', (err) => this.error(err))
    connection.on('close', (i) => this.log('CLOSE', i))
    connection.on('message', (m: IMessage) => this.onMessage(m));
    this.sendMessage('PING')
  }

  async onMessage(message: IMessage) {
    this.log('RECEIVE', message.type === 'binary' ? message.binaryData : message.utf8Data);
  }

  async sendMessage(message: string) {
    message = `${this.name}::${message}`;
    this.log('SEND', message);
    this.connection.send(message);
  }

  async log(type, ...messages) {
    console.log('[CLIENT]', `[${this.name}]`, type, ...messages);
  }

  async error(err: Error) {
    console.error('[CLIENT]', `[${this.name}]`, err);
  }
}
