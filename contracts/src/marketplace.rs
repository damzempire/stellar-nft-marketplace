use soroban_sdk::{Address, Env, Map, Symbol};

const MARKETPLACE: Symbol = Symbol::short("MARKET");
const LISTINGS: Symbol = Symbol::short("LISTINGS");
const MARKET_ADMIN: Symbol = Symbol::short("MARKET_ADMIN");

pub fn initialize(env: Env, admin: Address) {
    env.storage().instance().set(&MARKETPLACE, &admin);
    env.storage().instance().set(&MARKET_ADMIN, &admin);
    env.storage().instance().set(&LISTINGS, &Map::<u64, i128>::new(&env));
}

pub fn list(env: Env, token_id: u64, price: i128) {
    let owner = crate::nft::owner_of(env.clone(), token_id);
    owner.require_auth();

    let mut listings = env.storage().instance().get::<_, Map<u64, i128>>(&LISTINGS).unwrap();
    listings.set(token_id, price);
    env.storage().instance().set(&LISTINGS, &listings);
}

pub fn buy(env: Env, buyer: Address, token_id: u64) {
    let listings = env.storage().instance().get::<_, Map<u64, i128>>(&LISTINGS).unwrap();
    let price = listings.get(token_id).unwrap();
    
    buyer.require_auth();
    
    let seller = crate::nft::owner_of(env.clone(), token_id);
    crate::nft::transfer_from(env.clone(), seller, buyer.clone(), token_id);
    
    let mut listings = env.storage().instance().get::<_, Map<u64, i128>>(&LISTINGS).unwrap();
    listings.remove(token_id);
    env.storage().instance().set(&LISTINGS, &listings);
}

pub fn get_listing(env: Env, token_id: u64) -> Option<i128> {
    let listings = env.storage().instance().get::<_, Map<u64, i128>>(&LISTINGS).unwrap();
    listings.get(token_id)
}

pub fn cancel_listing(env: Env, token_id: u64) {
    let owner = crate::nft::owner_of(env.clone(), token_id);
    owner.require_auth();

    let mut listings = env.storage().instance().get::<_, Map<u64, i128>>(&LISTINGS).unwrap();
    listings.remove(token_id);
    env.storage().instance().set(&LISTINGS, &listings);
}
