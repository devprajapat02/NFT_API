const express = require('express');
const { ethers } = require('ethers')
const { abi } = require('../truffle/build/contracts/NFT_Market.json')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const jwtSecret = "qwerty"
const contractAddress = '0x444B995133F5a2bD1e97851eF3c2E67a9a6a495B'
const contractABI = abi

const generateToken = (address) => {
    const payload = { address }
    console.log(payload)
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
    return token
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
        return res.sendStatus(403);
        }
        console.log(user.address)
        req.user = user;
        next();
    });
}

function isAddress(address) {
    try {
      ethers.utils.getAddress(address);
      return true;
    } catch (error) {
      return false;
    }
}


app.get('/', (req, res) => {
    res.send("Hello World")
})

app.post('/test', (req, res) => {
    console.log(req.query)
    console.log(req.body)
    console.log(req.params)
    res.send("Hello World Test")
})

app.post('/login', (req, res) => {
    const token = generateToken(req.body.address)
    res.json({ token })
})

app.get('/api', authenticateToken, async (req, res) => {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const userAddress = await req.user.address
    const signer = await provider.getSigner(userAddress)
    const signedContract = await contract.connect(signer)
    await signedContract.add_nft("CC002", "CryptoCat", "0xf70A5464A58821eE295C636E16c7aBf5362a6d5f", 1, "Test NFT CryptoCat", "1");
    const keys = await contract.get_nft_list();
    res.send(keys)
})

app.get('/nfts/add', authenticateToken, async (req, res) => {

    // check query parameters
    if (!req.query.tokenId || !req.query.name || !req.query.owner || !req.query.price || !req.query.description || !req.query.imageURL) {
        res.json({
            "status": "error",
            "message": "Invalid query parameters"
        })
        return
    }

    if (!isAddress(req.query.owner)) {
        res.json({
            "status": "error",
            "message": "Invalid owner address"
        })
        return
    }

    const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const userAddress = await req.user.address
    
    const keys = await contract.get_nft_list();
    if (keys.includes(req.query.tokenId)) {
        res.json({
            "status": "error",
            "message": "NFT already exists"
        })
        return
    }
    const signer = await provider.getSigner(userAddress)
    const signedContract = await contract.connect(signer)
    const transaction = await signedContract.add_nft(req.query.tokenId, req.query.name, req.query.owner, req.query.price, req.query.description, req.query.imageURL);
    

    res.json({
        "status": "success",
        "message": "NFT added successfully",
        "transaction": transaction
    })
})

app.get('/nfts/update', authenticateToken, async (req, res) => {
    // check query parameters
    if (!req.query.tokenId || !req.query.name || !req.query.owner || !req.query.price || !req.query.description || !req.query.imageURL) {
        res.json({
            "status": "error",
            "message": "Invalid query parameters"
        })
        return
    }

    if (!isAddress(req.query.owner)) {
        res.json({
            "status": "error",
            "message": "Invalid owner address"
        })
        return
    }

    const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const userAddress = await req.user.address
    const keys = await contract.get_nft_list();
    if (!keys.includes(req.query.tokenId)) {
        res.json({
            "status": "error",
            "message": "NFT doesn't exist"
        })
        return
    }
    const signer = await provider.getSigner(userAddress)
    const signedContract = await contract.connect(signer)
    // const _ret = await signedContract.add_nft("CC002", "CryptoCat", "0xf70A5464A58821eE295C636E16c7aBf5362a6d5f", 1, "Test NFT CryptoCat", "1");
    const transaction = await signedContract.mod_nft(req.query.tokenId, req.query.name, req.query.owner, req.query.price, req.query.description, req.query.imageURL);
    res.json({
        "status": "success",
        "message": "NFT updated successfully",
        "transaction": transaction
    })
})

app.get('/nfts/delete', authenticateToken, async (req, res) => {
    // check query parameters
    if (!req.query.tokenId) {
        res.json({
            "status": "error",
            "message": "Invalid query parameters"
        })
        return
    }

    const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const userAddress = await req.user.address
    const keys = await contract.get_nft_list();
    if (!keys.includes(req.query.tokenId)) {
        res.json({
            "status": "error",
            "message": "NFT doesn't exist"
        })
        return
    }
    const signer = await provider.getSigner(userAddress)
    const signedContract = await contract.connect(signer)
    const transaction = await signedContract.del_nft(req.query.tokenId);
    res.json({
        "status": "success",
        "message": "NFT deleted successfully",
        "transaction": transaction
    })
})



app.get('/nfts', authenticateToken, async (req, res) => {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
    const contract = new ethers.Contract(contractAddress, contractABI, provider)

    if (req.query.tokenId) {
        const tokenId = req.query.tokenId
        const token = await contract.get_nft(tokenId)
        res.send(token)
    } else {
        const keys = await contract.get_nft_list();
        res.send(keys)
    }
})

app.listen(3000, () => {
    console.log("Listening")
})