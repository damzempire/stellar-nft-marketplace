use soroban_sdk::{Address, Env, Map, String, Symbol, Vec};

const NFT_CONTRACT: Symbol = Symbol::short("NFT");
const OWNER: Symbol = Symbol::short("OWNER");
const TOKEN_OWNERS: Symbol = Symbol::short("TOKEN_OWNERS");
const APPROVED: Symbol = Symbol::short("APPROVED");

pub fn initialize(env: Env, admin: Address) {
    env.storage().instance().set(&NFT_CONTRACT, &admin);
    env.storage().instance().set(&OWNER, &admin);
    env.storage().instance().set(&TOKEN_OWNERS, &Map::<Address, Vec<u64>>::new(&env));
    env.storage().instance().set(&APPROVED, &Map::<u64, Address>::new(&env));
}

pub fn mint(env: Env, to: Address, token_id: u64, metadata_uri: String) {
    let admin = env.storage().instance().get::<_, Address>(&OWNER).unwrap();
    admin.require_auth();

    let mut token_owners = env.storage().instance().get::<_, Map<Address, Vec<u64>>>(&TOKEN_OWNERS).unwrap();
    let mut owner_tokens = token_owners.get(to.clone()).unwrap_or(Vec::new(&env));
    owner_tokens.push_back(token_id);
    token_owners.set(to, owner_tokens);
    env.storage().instance().set(&TOKEN_OWNERS, &token_owners);

    env.storage().instance().set(&Symbol::short(&format!("TOKEN_{}", token_id)), &to);
    env.storage().instance().set(&Symbol::short(&format!("META_{}", token_id)), &metadata_uri);
}

pub fn owner_of(env: Env, token_id: u64) -> Address {
    env.storage().instance().get::<_, Address>(&Symbol::short(&format!("TOKEN_{}", token_id))).unwrap()
}

pub fn approve(env: Env, owner: Address, approved: Address, token_id: u64) {
    let token_owner = owner_of(env.clone(), token_id);
    token_owner.require_auth();

    let mut approved_map = env.storage().instance().get::<_, Map<u64, Address>>(&APPROVED).unwrap();
    approved_map.set(token_id, approved);
    env.storage().instance().set(&APPROVED, &approved_map);
}

pub fn transfer_from(env: Env, from: Address, to: Address, token_id: u64) {
    let approved_map = env.storage().instance().get::<_, Map<u64, Address>>(&APPROVED).unwrap();
    let approved = approved_map.get(token_id).unwrap_or(from.clone());
    approved.require_auth();

    env.storage().instance().set(&Symbol::short(&format!("TOKEN_{}", token_id)), &to);
    
    let mut token_owners = env.storage().instance().get::<_, Map<Address, Vec<u64>>>(&TOKEN_OWNERS).unwrap();
    let mut from_tokens = token_owners.get(from.clone()).unwrap_or(Vec::new(&env));
    from_tokens.remove(from_tokens.iter().position(|&id| id == token_id).unwrap());
    token_owners.set(from, from_tokens);

    let mut to_tokens = token_owners.get(to.clone()).unwrap_or(Vec::new(&env));
    to_tokens.push_back(token_id);
    token_owners.set(to, to_tokens);
    env.storage().instance().set(&TOKEN_OWNERS, &token_owners);
}
