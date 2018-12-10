const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
	res.send(bitcoin);
})

//create new transaction
app.post('/transaction', function(req, res){
	console.log('/transaction');
	const newTransaction = req.body;
	console.log(newTransaction);
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	// const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({ note: `Transaction will be added in block ${blockIndex}.`});
})

app.post('/transaction/broadcast', function(req, res) {
	console.log(req.body);
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises).then(data => {
		res.json({note: 'Transaction created and broadcast successfully.'});
	});
})

app.post('/transaction/broadcast/create_user', function(req, res) {
	console.log(req.body);
	const newTransaction = bitcoin.createNewTransactionUser(req.body.full_name, req.body.last_name, req.body.birthday, req.body.role, req.body.user_name, req.body.user_id, req.body.description);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises).then(data => {
		res.json({note: 'Transaction created and broadcast successfully.'});
	});
})

app.post('/transaction/broadcast/create_grade', function(req, res) {
	console.log(req.body);
	const newTransaction = bitcoin.createNewTransactionGrade(req.body.user_id, req.body.credit_hour, req.body.grade_point, req.body.grade_state, req.body.teacher_name, req.body.subject_name, req.body.date);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises).then(data => {
		res.json({note: 'Transaction created and broadcast successfully.'});
	});
})

app.post('/transaction/broadcast/institution', function(req, res) {
	console.log(req.body);
	const newTransaction = bitcoin.createNewTransactionInst(req.body.institution, req.body.description, req.body.division);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises).then(data => {
		res.json({note: 'Transaction created and broadcast successfully.'});
	});
})
//mine a block
app.get('/mine', function(req, res) {
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash =lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};

	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

	// bitcoin.createNewTransaction(12.5, "00", nodeAddress);

	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/recieve-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};
		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises).then(data => {
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};

		return rp(requestOptions);
	}).then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});

});

app.post('/recieve-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex){
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = [];
		res.json({
			note: 'New block recieve and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

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

	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({node: 'New node registered with network successfully.'});
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res){
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});
	res.json({note: 'Bulk registration successful.'});
});

app.get('/consensus', function(req, res) {
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};
		requestPromises.push(rp(requestOptions));
	});
	Promise.all(requestPromises).then(blockchains => {
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if(blockchain.chain.length > maxChainLength){
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			}
		});

		if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
			res.json({
				note: 'Current chain has not been replaced.',
				chain: bitcoin.chain
			});
		}
		else //if (newLongestChain && bitcoin.chainIsValid(newLongestChain)){
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: bitcoin.chain
			})
		// }
	});

});

app.get('/block/:blockHash', function(req, res) {
	const blockHash = req.params.blockHash;
	const correctBlock = bitcoin.getBlock(blockHash);
	res.json({
		block: correctBlock
	});

});

app.get('/transaction/:transactionId', function(req, res) {
	const transactionId = req.params.transactionId;
	const transactionData = bitcoin.getTransaction(transactionId);
	res.json({
		transaction: transactionData.transaction,
		block: transactionData.block
	});

});

app.get('/address/:address', function(req, res) {
	const address = req.params.address;
	const addressData = bitcoin.getAddressData(address);
	res.json({
		addressData: addressData
	});

});

app.get('/institutions', function(req, res) {	
	const addressData = bitcoin.getInstitution();
	res.json({
		addressData: addressData
	});

});

app.get('/sha256/:address', function(req, res) {	
	const address = req.params.address;
	const hash = bitcoin.hashLogin(address);
	res.json({
		addressData: hash
	});

});

app.get('/user/:user_id', function(req, res) {	
	const user_id = req.params.user_id;	
	const user_id_hash = bitcoin.hashLogin(user_id);
	const data = bitcoin.getUserData(user_id_hash);
	const userData = bitcoin.getUserInfo(user_id_hash);
	res.json({
		data: data,
		userData: userData
	});

});

app.get('/user_id_hash/:user_id', function(req, res) {	
	const user_id = req.params.user_id;	
	const user_id_hash = bitcoin.hashLogin(user_id);
	const userData = bitcoin.getUserInfo(user_id_hash);
	res.json({		
		userData
	});

});

app.get('/blockchain_info', function(req, res) {		
	res.json({
		bitcoin
	});

});

app.get('/block-explorer', function(req, res) {
	res.sendFile('./block-explorer/index.html', { root: __dirname });
});

app.get('/create-trx', function(req, res) {
	res.sendFile('./block-explorer/create.html', { root: __dirname });
});

app.get('/create-ledger', function(req, res) {
	res.sendFile('./block-explorer/create_ledger.html', { root: __dirname });
});

app.get('/panel', function(req, res) {
	res.sendFile('./block-explorer/student_panel.html', { root: __dirname });
});
app.get('/bet', function(req, res) {
	res.sendFile('./block-explorer/bet.html', { root: __dirname });
});

app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});
