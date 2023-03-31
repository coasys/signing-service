import { Scenario } from "@holochain/tryorama";
import test from "tape-promise/tape.js";
import { resolve } from "path";

export async function test_signing(t: any) {
    const scenario = new Scenario();

    const aliceHapps = await scenario.addPlayerWithApp(
        {
            bundle: {
                manifest: {
                    manifest_version: "1",
                    name: "crypto",
                    roles: [{
                        name: "main",
                        dna: {
                            //@ts-ignore
                            path: resolve(dnas[0].source.path)
                        }
                    }]
                },
                resources: {}
            },
        }
    );

    const signData = await aliceHapps.cells[0].callZome({
        zome_name: "crypto",
        fn_name: "sign",
        payload: "data-to-sign"
    });
    const verify = await aliceHapps.cells[0].callZome({
        zome_name: "crypto", 
        fn_name: "verify", 
        payload: {agent_key: aliceHapps.agentPubKey, signature: signData, data: "data-to-sign"}
    })
    t.equal(verify, true);

    await scenario.cleanUp();
}

test("test", async (t) => {
    await test_signing(t)
    t.end()
})