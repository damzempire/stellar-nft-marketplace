#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::{Ledger, LedgerInfo};
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let admin = Address::generate(&env);
        
        // Test initialization
        StellarNFTMarketplace::initialize(env.clone(), admin.clone());
        
        // Verify admin is set
        let stored_admin = env.storage().instance().get(&Symbol::new(&env, "admin"));
        assert_eq!(stored_admin, Some(admin));
    }

    #[test]
    fn test_version() {
        assert_eq!(StellarNFTMarketplace::version(), 1);
    }

    #[test]
    fn test_nft_mint() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let minter = Address::generate(&env);
        let recipient = Address::generate(&env);
        
        // Initialize contracts
        StellarNFTMarketplace::initialize(env.clone(), admin.clone());
        NFTContract::initialize(env.clone(), admin.clone());
        
        // Mint NFT
        let token_id = 1u64;
        let metadata_uri = String::from_str(&env, "ipfs://QmTest123");
        
        NFTContract::mint(env.clone(), recipient.clone(), token_id, metadata_uri.clone());
        
        // Verify ownership
        let owner = NFTContract::owner_of(env.clone(), token_id);
        assert_eq!(owner, recipient);
        
        // Verify metadata URI
        let uri = NFTContract::token_uri(env.clone(), token_id);
        assert_eq!(uri, metadata_uri);
    }

    #[test]
    fn test_marketplace_listing() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let nft_contract = Address::generate(&env);
        
        // Initialize contracts
        StellarNFTMarketplace::initialize(env.clone(), admin.clone());
        MarketplaceContract::initialize(env.clone(), admin.clone());
        
        // List NFT for sale
        let token_id = 1u64;
        let price = 100u128.into();
        
        MarketplaceContract::list_nft(
            env.clone(),
            seller.clone(),
            token_id,
            price,
            nft_contract.clone(),
        );
        
        // Verify listing exists
        let listing = MarketplaceContract::get_listing(env.clone(), token_id);
        assert!(listing.is_some());
    }
}
