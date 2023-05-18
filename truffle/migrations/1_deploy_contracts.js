const NFT_Market = artifacts.require("NFT_Market");

module.exports = function (deployer) {
    deployer.deploy(NFT_Market);
}