import Server from './server';
import Client from './client';

let server = new Server();

let clients = [new Client('Client1'), new Client('Client2')];

// Allows events to be triggered through keypresses

import readline from 'readline';
import process from 'process';
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
let i = readline.createInterface(process.stdin, process.stdout);

function prompt() {
  i.question('> ', (ans) => {
    handleCommand(ans);
    setTimeout(prompt, 500)
  })
}

function handleCommand(str: string) {
  let split = str.split(' ');
  let cmd = split[0]
  let params = split.slice(1);
  switch (cmd) {
    case 'update':
      if (params[0] === 'sequence') {} // Update puzzle with params[1]
      else if (params[0] === 'marks') {} // Update marks with params[1]
      else console.log(`Cannot update ${params[0]}`);
      break;
    case 'send':
      if (params[0] === 'server') {
        let message = params.slice(1).join(' ');
        server.wsServer.connections.forEach(e => {
          server.sendMessage(message, e);
        })
      }
      else if (params[0] === 'client') {
        let message = params.slice(2).join(' ');
        let from = params[1];
        let fromClient = clients.find(e => e.name === from);
        if (!fromClient) console.log('No client with that name');
        else fromClient.sendMessage(message);
      } else console.log(`Cannot send to ${params[0]}`)
      break;
    default: console.log('No command with that name');
  }
}

setTimeout(() => {
  console.log('Type a command...')
  prompt();
}, 1000)