#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

mod nft;
mod marketplace;
mod metadata;
mod tests;

use nft::NFTContract;
use marketplace::MarketplaceContract;

#[contract]
pub struct StellarNFTMarketplace;

#[contractimpl]
impl StellarNFTMarketplace {
    /// Initialize the marketplace with admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&Symbol::new(&env, "admin")) {
            panic!("Contract already initialized");
        }
        
        NFTContract::initialize(env.clone(), admin.clone());
        MarketplaceContract::initialize(env, admin);
    }

    /// Get contract version
    pub fn version() -> u32 {
        1
    }
}
