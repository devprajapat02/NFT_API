const NFT_Market = artifacts.require("NFT_Market");
const { assert } = require("chai");

contract("NFT_Market", (accounts) => {
  it("Should add a new NFT to the market", async () => {
		const instance = await NFT_Market.deployed();
		await instance.add_nft("CC001", "CryptoCat", accounts[0], 1, "Test NFT CryptoCat", "1");
		const nft = await instance.get_nft("CC001");
		console.log(nft)
		assert.equal(nft.id, "CC001", "Couldn't fetch newly added NFT");
	});

	it("Should fetch NFT from the given id", async () => {
		const instance = await NFT_Market.deployed();
		const nft = await instance.get_nft("CC001");
		assert.equal(nft.id, "CC001", "Couldn't fetch NFT");
	})

	it("Should fetch all NFTs", async () => {
		const instance = await NFT_Market.deployed();
		await instance.add_nft("CC002", "CryptoCat", accounts[0], 1, "Test NFT CryptoCat", "1");
		await instance.add_nft("CC003", "CryptoCat", accounts[0], 1, "Test NFT CryptoCat", "1");
		await instance.add_nft("CC004", "CryptoCat", accounts[0], 1, "Test NFT CryptoCat", "1");
		const nfts = await instance.get_nft_list();
		assert.equal(nfts.length, 4, "Couldn't fetch all NFTs");
	})

	it("Should modify NFT", async () => {
		instance = await NFT_Market.deployed()
		await instance.mod_nft("CC001", "CryptoCat", accounts[0], 1, "Test modified", "1");
		const nft = await instance.get_nft("CC001");
		assert.equal(nft.description, "Test modified", "Couldn't modify NFT");
	})

	it("Should remove NFT", async () => {
		instance = await NFT_Market.deployed()
		const keys = await instance.get_nft_list();
		console.log(keys)
		await instance.del_nft("CC001");
		const nft = await instance.get_nft_list();

		let found = false;
		for (let i = 0; i < nft.length; i++) {
			if (nft[i] == "CC001") found = true;
		}

		assert.equal(found, false, "Couldn't remove NFT");
	})
});
