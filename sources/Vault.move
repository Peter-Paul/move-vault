module 0x860bf7ab93c6c27bf5768a00d848f566684ae02be34836e8d36293908115f998::vault {
    use std::signer;
    use std::coin;

    struct Vault<CoinType> {
        owner: address,
        balance: coin::Coin<CoinType>,
    }

    public fun create_vault<CoinType>(account: &signer): Vault<CoinType> {
        let owner = signer::address_of(account);
        let initial_balance = coin::zero<CoinType>();
        Vault { owner, balance: initial_balance }
    }

    public fun deposit<CoinType>(vault: &mut Vault<CoinType>, coins: coin::Coin<CoinType>) {
        coin::merge(&mut vault.balance, coins);
    }

    public fun remove<CoinType>(vault: &mut Vault<CoinType>, account: &signer, amount: u64): coin::Coin<CoinType> {
        let caller = signer::address_of(account);
        assert!(caller == vault.owner, 0x1 /* Only the owner can withdraw */);
        let coins = coin::withdraw(account,amount);
        coins
    }

    public fun get_balance<CoinType>(vault: &Vault<CoinType>): u64 {
        coin::value(&vault.balance)
    }
}
