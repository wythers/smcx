import { toNano, Cell } from "@ton/core";
import { Echo } from "../wrappers/Echo";
import { NetworkProvider } from '@ton/blueprint';
import configObj from '../smcxConfig.json'

export async function run(provider: NetworkProvider) {
        const echo = provider.open(Echo.createFromConfig({ masterAddress: configObj.smc.echo.masterAddress },
                Cell.fromBoc(Buffer.from(configObj.smc.echo.codeBOC, "base64"))[0]));

        await echo.sendEchoableTON(provider.sender(), toNano('0.012'));
}