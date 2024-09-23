# SMCX -- smart contract creator



```javscript
        // specialize smcxConfig.json file and then
        $ npm start
```

And

```javascript
        // take echo contract as an example
        import { useEchoContract } from 'Your-company-lib/smc/echo'


        function App() {
                const { status, sendEchoableTON } = useEchoContract();
                
                return (
                        <div className='App'>
                                <button
                                        disabled={status == 'done'}
                                        className={`Button Active`}
                                        onClick={() => {
                                        sendEchoableTON("0.012");
                                }}
                                >
                                        Echo
                                </button>
                        </div>
                );
        }

```