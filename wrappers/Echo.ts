import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type EchoConfig = {
    masterAddress: string
};

enum OpCode {
    Echo = 0xf8a7eaa,
    transfer = 0x7362d0cc,
}

export function echoConfigToCell(config: EchoConfig): Cell {
    return beginCell().storeAddress(Address.parse(config.masterAddress)).endCell();
}

export class Echo implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Echo(address);
    }

    static createFromConfig(config: EchoConfig, code: Cell, workchain = 0) {
        const data = echoConfigToCell(config);
        const init = { code, data };
        return new Echo(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendEchoableTON(provider: ContractProvider, via: Sender, value: bigint) { 
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(OpCode.Echo, 32). endCell(),
        });
    }

    async sendTON(provider: ContractProvider, via: Sender, value: bigint) { 
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(OpCode.transfer, 32).storeStringTail("echo test").endCell()
        });
    }
}
