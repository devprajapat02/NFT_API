// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract NFT_Market {

    struct NFT {
        string id;
        string name;
        address owner;
        uint256 price;
        string description;
        string imageURL;
    }

    mapping(string => NFT) nfts;
    string[] nfts_keys;

    function add_nft (
					string calldata id, 
					string calldata name, 
					address owner, 
					uint256 price, 
					string calldata description, 
					string calldata imageURL
        ) public returns (NFT memory) {
        
        if (nfts[id].owner != address(0)) {
            return NFT("NFT already exists", "", address(0), 0, "", "");
        }

        nfts[id] = NFT(id, name, owner, price, description, imageURL);
        nfts_keys.push(id);

				return nfts[id];
    }

    function get_nft_list () public view returns (string[] memory) {
        
        return nfts_keys;
    }

    function get_nft (string calldata id) public view returns (NFT memory) {
        if (nfts[id].owner == address(0)) {
            return NFT("NFT does not exist", "", address(0), 0, "", "");
        }

        return nfts[id];
    }

    function mod_nft (
				string calldata id, 
				string calldata name, 
				address owner, 
				uint256 price, 
				string calldata description, 
				string calldata imageURL
			) public returns (NFT memory) {
        if (nfts[id].owner == address(0)) {
            return NFT("NFT does not exist", "", address(0), 0, "", "");
        }

        nfts[id] = NFT(id, name, owner, price, description, imageURL);
        return nfts[id];
    }

    function del_nft (string memory id) public returns (bool) {
        if (nfts[id].owner == address(0)) {
            return false;
        }
        delete nfts[id];

        if (keccak256(bytes(nfts_keys[nfts_keys.length - 1])) == keccak256(bytes(id))) {
            nfts_keys.pop();
        } else {
            for (uint i = 0; i < nfts_keys.length; i++) {
                if (keccak256(bytes(nfts_keys[i])) == keccak256(bytes(id))) {
                    nfts_keys[i] = nfts_keys[nfts_keys.length - 1];
                    nfts_keys.pop();
                    break;
                }
            }
        }

        return nfts[id].owner == address(0);
    }
}