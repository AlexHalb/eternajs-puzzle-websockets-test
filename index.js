"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var server_1 = __importDefault(require("./server"));
var client_1 = __importDefault(require("./client"));
var server = new server_1["default"]();
var clients = [new client_1["default"]('Client1'), new client_1["default"]('Client2')];
// Allows events to be triggered through keypresses
var readline_1 = __importDefault(require("readline"));
var process_1 = __importDefault(require("process"));
readline_1["default"].emitKeypressEvents(process_1["default"].stdin);
process_1["default"].stdin.setRawMode(true);
var i = readline_1["default"].createInterface(process_1["default"].stdin, process_1["default"].stdout);
function prompt() {
    i.question('> ', function (ans) {
        handleCommand(ans);
        setTimeout(prompt, 500);
    });
}
function handleCommand(str) {
    var split = str.split(' ');
    var cmd = split[0];
    var params = split.slice(1);
    switch (cmd) {
        case 'update':
            if (params[0] === 'sequence') { } // Update puzzle with params[1]
            else if (params[0] === 'marks') { } // Update marks with params[1]
            else
                console.log("Cannot update " + params[0]);
            break;
        case 'send':
            if (params[0] === 'server') {
                var message_1 = params.slice(1).join(' ');
                server.wsServer.connections.forEach(function (e) {
                    server.sendMessage(message_1, e);
                });
            }
            else if (params[0] === 'client') {
                var message = params.slice(2).join(' ');
                var from_1 = params[1];
                var fromClient = clients.find(function (e) { return e.name === from_1; });
                if (!fromClient)
                    console.log('No client with that name');
                else
                    fromClient.sendMessage(message);
            }
            else
                console.log("Cannot send to " + params[0]);
            break;
        default: console.log('No command with that name');
    }
}
setTimeout(function () {
    console.log('Type a command...');
    prompt();
}, 1000);
