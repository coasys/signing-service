import { Orchestrator, Config, InstallAgentsHapps } from '@holochain/tryorama'
import { TransportConfigType, ProxyAcceptConfig, ProxyConfigType } from '@holochain/tryorama'
import path from 'path'

const network = {
    transport_pool: [{
      type: TransportConfigType.Proxy,
      sub_transport: {type: TransportConfigType.Quic},
      proxy_config: {
        type: ProxyConfigType.LocalProxyServer,
        proxy_accept_config: ProxyAcceptConfig.AcceptAll
      }
    }],
    bootstrap_service: "https://bootstrap.holo.host"
};
//const conductorConfig = Config.gen({network});
const conductorConfig = Config.gen();

// Construct proper paths for your DNAs
const signing = path.join(__dirname, '../../workdir/signing.dna')

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [signing] // contains 1 dna, the "signing" dna
  ]
]

const orchestrator = new Orchestrator()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

orchestrator.registerScenario("sign and verify data", async (s, t) => {
  const [alice] = await s.players([conductorConfig])
  const [[alice_happ]] = await alice.installAgentsHapps(installation)

  //Create a public expression from alice
  const signData = await alice_happ.cells[0].call("crypto", "sign", "data-to-sign");
  const verify = await alice_happ.cells[0].call("crypto", "verify", {agent_key: alice_happ.agent, signature: signData, data: "data-to-sign"})
  t.equal(verify, true);

  t.pass();
})


// Run all registered scenarios as a final step, and gather the report,
// if you set up a reporter
const report = orchestrator.run()

// Note: by default, there will be no report
console.log(report)