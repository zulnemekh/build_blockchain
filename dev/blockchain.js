const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

function Blockchain() {
	this.chain = [];
	this.pendingTransaction = [];
	this.networkNodes = [];
	this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransaction,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransaction = [];
	this.chain.push(newBlock);

	return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length -1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient
	};

	this.pendingTransaction.push(newTransaction);
	
	return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	// bitcoin.hashBlock = function(previousBlockHash, currentBlockData, nonce);
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000'){
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
}


// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
		bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises).then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: {allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
			json: true
		};
		return rp(bulkRegisterOptions);
	}).then(data =>{
		res.json({node: 'New node registered with network successfully.'});
	});
});

// register a node with the network
app.post('/register-node', function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

	if (nodeNotAlreadyPresent && notCurrentNode) 
	bitcoin.networkNodes.push(newNodeUrl);
	res.json({node: 'New node registered with network successfully.'});
});

// register multiple nodes at once
app.post('/register-node-bulk', function(req, res){

});

module.exports = Blockchain;