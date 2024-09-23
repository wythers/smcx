# SMCX -- smart contract creator



```javscript
// specialize smcxConfig.json file and then
$ npm start
```

And

```javascript
// take echo contract as an example, copy library/echo to your project dir
import { useEchoContract } from 'echo'

function App() {
//        
//             status from "standby" -> "processing" -> "done"
//        
        const { status, sendEchoableTON } = useEchoContract();
                
        return (
                <div className='App'>
                        <button
                                disabled={status == 'done'}
                                className={`Button Active`}
                                onClick={() => {
                                sendEchoableTON("0.012");
                        }}>
                                Echo
                        </button>
                </div>
        );
}

```