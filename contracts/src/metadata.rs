use soroban_sdk::{Env, String, Symbol};

const METADATA: Symbol = Symbol::short("METADATA");

pub fn get(env: Env, token_id: u64) -> String {
    env.storage().instance()
        .get::<_, String>(&Symbol::short(&format!("META_{}", token_id)))
        .unwrap_or_else(|| String::from_str(&env, ""))
}

pub fn set(env: Env, token_id: u64, metadata_uri: String) {
    env.storage().instance().set(&Symbol::short(&format!("META_{}", token_id)), &metadata_uri);
}

pub fn validate_ipfs(uri: &str) -> bool {
    uri.starts_with("ipfs://") || uri.starts_with("https://ipfs.io/ipfs/")
}
