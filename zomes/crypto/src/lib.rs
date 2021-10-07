use hdk::prelude::*;
use hdk::ed25519::sign as internal_sign;
use hdk::ed25519::verify_signature;

/// Sign something
#[hdk_extern]
pub fn sign(data: String) -> ExternResult<Signature> {
    Ok(internal_sign(agent_info()?.agent_latest_pubkey, data)?)
}

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct VerifyInput {
    pub agent_key: AgentPubKey, 
    pub signature: Signature, 
    pub data: String
}

/// Create an expression and link it to yourself publicly
#[hdk_extern]
pub fn verify(data: VerifyInput) -> ExternResult<bool> {
    verify_signature(data.agent_key, data.signature, data.data)
}
