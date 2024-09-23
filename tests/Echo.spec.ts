import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { Echo } from '../wrappers/Echo';
import '@ton/test-utils';
import configObj from '../smcxConfig.json'

describe('Echo', () => {
    let code: Cell;

    beforeAll(async () => {
        code = Cell.fromBoc(Buffer.from(configObj.smc.echo.codeBOC, "base64"))[0];
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let echo: SandboxContract<Echo>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');
        echo = blockchain.openContract(Echo.createFromConfig({masterAddress: deployer.address.toString() }, code));

        const deployResult = await echo.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: echo.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {});

    it('should not echo from owner', async () => {
        const result = await deployer.send({
            to: echo.address,
            value: toNano('1'),
        });
        expect(result.transactions).not.toHaveTransaction({
            from: echo.address,
            to: deployer.address,
        });
    });

    it('should echo from another wallet', async () => {
        let user = await blockchain.treasury('user');
        const result = await user.send({
            to: echo.address,
            value: toNano('1'),
            body: beginCell().storeUint(0x7362d0cc, 32).storeStringTail('Hello, world!').endCell(),
        });
        expect(result.transactions).toHaveTransaction({
            from: echo.address,
            to: deployer.address,
            body: beginCell()
                .storeUint(0, 32)
                .storeStringTail('Hello, world!')
                .endCell(),
            value: (x) => (x ? toNano('0.99') <= x && x <= toNano('1') : false),
        });
    });
});
