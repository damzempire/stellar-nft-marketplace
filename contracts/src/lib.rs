#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, symbol_short};

#[contract]
pub struct NFTMarketplace;

#[contractimpl]
impl NFTMarketplace {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    pub fn mint(env: Env, to: Address, token_id: u64, metadata_uri: String) {
        let admin = env.storage().instance().get::<_, Address>(&symbol_short!("ADMIN")).unwrap();
        admin.require_auth();

        env.storage().instance().set(&symbol_short!("OWNER_1"), &to);
        env.storage().instance().set(&symbol_short!("META_1"), &metadata_uri);
    }

    pub fn owner_of(env: Env, _token_id: u64) -> Address {
        env.storage().instance().get::<_, Address>(&symbol_short!("OWNER_1")).unwrap()
    }

    pub fn transfer(env: Env, from: Address, to: Address, _token_id: u64) {
        from.require_auth();
        env.storage().instance().set(&symbol_short!("OWNER_1"), &to);
    }

    pub fn get_metadata(env: Env, _token_id: u64) -> String {
        env.storage().instance().get::<_, String>(&symbol_short!("META_1")).unwrap_or_else(|| String::from_str(&env, ""))
    }
}
