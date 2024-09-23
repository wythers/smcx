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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEchoContract = useEchoContract;
const echo_1 = require("./contract/echo");
const useAsync_1 = require("./hooks/useAsync");
const core_1 = require("@ton/core");
const react_1 = require("react");
const ton_access_1 = require("@orbs-network/ton-access");
const ui_react_1 = require("@tonconnect/ui-react");
const ton_1 = require("@ton/ton");
const config_json_1 = __importDefault(require("./config.json"));
function useEchoContract() {
    const client = useTonClient();
    const { sender } = useTonConnect();
    const [status, setStatus] = (0, react_1.useState)("standby");
    const echoContract = (0, useAsync_1.useAsyncInitialize)(() => __awaiter(this, void 0, void 0, function* () {
        if (!client)
            return;
        const contract = new echo_1.Echo(core_1.Address.parse(config_json_1.default.echoAddress));
        return client.open(contract);
    }), [client]);
    return {
        status: status,
        sendEchoableTON: (v) => __awaiter(this, void 0, void 0, function* () {
            try {
                setStatus("processing");
                yield (echoContract === null || echoContract === void 0 ? void 0 : echoContract.sendEchoableTON(sender, (0, core_1.toNano)(v)));
            }
            catch (e) {
                setStatus("standby");
                return;
            }
            setStatus("done");
        }),
    };
}
function useTonClient() {
    return (0, useAsync_1.useAsyncInitialize)(() => __awaiter(this, void 0, void 0, function* () {
        return new ton_1.TonClient({
            endpoint: yield (0, ton_access_1.getHttpEndpoint)({ network: 'mainnet' }),
        });
    }));
}
function useTonConnect() {
    const [tonConnectUI] = (0, ui_react_1.useTonConnectUI)();
    return {
        sender: {
            send: (args) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const result = yield tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: (_a = args.body) === null || _a === void 0 ? void 0 : _a.toBoc().toString('base64'),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000,
                });
                if (result.boc == "") {
                    throw new Error("Echo: Transaction Number exeception.");
                }
            }),
        }
    };
}
