"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var websocket_1 = require("websocket");
var http_1 = __importDefault(require("http"));
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.server = http_1["default"].createServer(function (request, response) {
            _this.log('RECEIVED REQUEST', 'FOR', request.url);
            response.writeHead(404);
            response.end();
        });
        this.server.listen(8080, function () { return _this.log('LISTEN', 'on port 8080'); });
        this.wsServer = new websocket_1.server({
            httpServer: this.server,
            autoAcceptConnections: false
        });
        this.wsServer.on('request', function (req) { return _this.onRequest(req); });
    }
    Server.prototype.onRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.originAllowed(request.origin)) {
                    // request.reject();
                    this.log('REJECT ORIGIN', request.origin);
                    // return;
                }
                connection = request.accept('echo-protocol', request.origin);
                this.log('ACCEPT CONNECTION');
                connection.on("message", function (data) { return _this.onMessage(data, connection); });
                connection.on('close', function (code, desc) { return _this.log('CLOSE', code, desc); });
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.onMessage = function (message, conn) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, idx, user, text;
            return __generator(this, function (_a) {
                msg = message.utf8Data;
                idx = msg.indexOf('::');
                user = msg.slice(0, idx);
                text = msg.slice(idx + 2);
                if (text === 'PING')
                    this.sendMessage('PONG', conn);
                this.log('RECEIVE', text, 'FROM', user);
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.sendMessage = function (message, to) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.log('SEND', message);
                to.send(message);
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.originAllowed = function (origin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    Server.prototype.error = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.error('[SERVER]', err);
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.log = function (type) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log.apply(console, __spreadArrays(['[SERVER]', type], messages));
                return [2 /*return*/];
            });
        });
    };
    return Server;
}());
exports["default"] = Server;
