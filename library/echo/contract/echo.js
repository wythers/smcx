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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Echo = void 0;
exports.echoConfigToCell = echoConfigToCell;
const core_1 = require("@ton/core");
var OpCode;
(function (OpCode) {
    OpCode[OpCode["Echo"] = 260734634] = "Echo";
    OpCode[OpCode["Transfer"] = 1935855820] = "Transfer";
})(OpCode || (OpCode = {}));
function echoConfigToCell(config) {
    return (0, core_1.beginCell)().storeAddress(core_1.Address.parse(config.masterAddress)).endCell();
}
class Echo {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new Echo(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = echoConfigToCell(config);
        const init = { code, data };
        return new Echo((0, core_1.contractAddress)(workchain, init), init);
    }
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                body: (0, core_1.beginCell)().endCell(),
            });
        });
    }
    sendEchoableTON(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                body: (0, core_1.beginCell)().storeUint(OpCode.Echo, 32).endCell(),
            });
        });
    }
    sendTON(provider_1, via_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (provider, via, value, comment = "") {
            yield provider.internal(via, {
                value,
                sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                body: (0, core_1.beginCell)().storeUint(OpCode.Transfer, 32).storeStringTail(comment).endCell()
            });
        });
    }
}
exports.Echo = Echo;
