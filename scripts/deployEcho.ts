import { toNano, Cell } from '@ton/core';
import { Echo } from '../wrappers/Echo';
import { NetworkProvider } from '@ton/blueprint';
import configObj from '../smcxConfig.json'
import fs from 'fs'

export async function run(provider: NetworkProvider) {
    const echo = provider.open(Echo.createFromConfig({ masterAddress: configObj.smc.echo.masterAddress },
        Cell.fromBoc(Buffer.from(configObj.smc.echo.codeBOC, "base64"))[0]));
    const TON = configObj.deployTON;
    if (! await provider.isContractDeployed(echo.address)) {
        await echo.sendDeploy(provider.sender(), toNano(TON));
        await provider.waitForDeploy(echo.address);
    }

    fs.writeFileSync('library/echo/config.json', JSON.stringify({
        echoAddress: echo.address.toString()
    }))

    // run methods on `echo`
}
