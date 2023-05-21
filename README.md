# Smart Contract Backend Interface

This repository contains a backend interface that interacts with a smart contract. The smart contract stores NFTs as data structures and provides functions to add, modify, and delete them. The backend provides API endpoints for managing these NFTs.

## Prerequisites

To deploy and interact with the smart contract, follow these instructions:

1. Install Ganache, a local blockchain development tool.
   - [Ganache Installation Guide](https://www.trufflesuite.com/ganache)
2. Set up Ganache by creating a local blockchain network.
   - Launch Ganache and configure the network settings as needed.
   - Make note of the network URL and port for later use.

## API Endpoints

Note: All endpoints are protected and require valid JWT token for access.
The backend interface exposes the following API endpoints:

1. **POST /login**:
   - Requires account address.
   - Returns a JWT token valid for 1 hour.
   - Use this endpoint to obtain a token for subsequent API calls.

2. **GET /nfts**:
   - Returns a list of all NFT IDs.
   - This endpoint retrieves the IDs of all stored NFTs.

3. **GET /nfts/{tokenId}**:
   - Requires a tokenId as a path parameter.
   - Returns details about the specified NFT.
   - Use this endpoint to retrieve information about a specific NFT.

4. **GET /nfts/add**:
   - Requires the following parameters in the request body: `tokenId`, `name`, `owner`, `price`, `description`, `imageURL`.
   - Adds a new token to the contract with the provided details.
   - Use this endpoint to create a new NFT.

5. **GET /nfts/update**:
   - Requires the following parameters in the request body: `tokenId`, `name`, `owner`, `price`, `description`, `imageURL`.
   - Updates an existing token on the contract with the provided details.
   - Use this endpoint to modify the details of an existing NFT.

6. **GET /nfts/{tokenId}**:
   - Requires a tokenId as a path parameter.
   - Deletes the specified NFT from the contract.
   - Use this endpoint to remove an NFT from the system.

## Deployment

To deploy the smart contract locally using Ganache, follow these steps:

1. Set up Ganache by launching the application and configuring the desired network settings.
2. Deploy the smart contract on the Ganache network using Truffle framework.
3. Deploy the smart contract using Truffle:
   - `cd truffle/`
   - `npx truffle test`
   - `npx truffle migrate`
  This command will compile and deploy the smart contract to the Ganache network specified in the Truffle configuration file.
4. Make note of the contract address for later use.

## Usage

1. Clone this repository.
2. Install the required dependencies by running `npm install`.
3. Configure the backend application to connect to the deployed smart contract:
   - Set the contract address in the appropriate configuration file or environment variable.
   - Provide the network URL and port obtained from Ganache.
4. Start the backend server by running `npx nodemon server/server.js`.
5. Use the provided API endpoints to interact with the NFTs stored in the smart contract (base URL: http://127.0.0.1:3000).

Note: Ensure that you have valid authentication credentials (JWT token) to access the protected endpoints.

Feel free to modify and extend this backend interface to suit your specific requirements.
