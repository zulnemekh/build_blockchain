const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

// blockchain buyu neg blockt hadgalagdah medeelel
function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
	this.createNewBlock(100, '0', '0');
}

// shine block uusgeh
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions= [];
	this.chain.push(newBlock);

	return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length -1];
};

Blockchain.prototype.getBlockchainInfo = function() {
	return this.chain;
};

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;

};

// create an institution
Blockchain.prototype.createNewTransactionInst = function(institution, description, division) {
	const newTransaction = {
		institution: institution,
		description: description,
		division: division,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;

};

// create a grade
Blockchain.prototype.createNewTransactionGrade = function(user_id, credit_hour, grade_point, grade_state, teacher_name, subject_name, date) {
	const user_id_hash = sha256(user_id);
	const newTransaction = {
		user_id: user_id_hash,
		credit_hour: credit_hour, 
		grade_point: grade_point,
		grade_state: grade_state,
		teacher_name: teacher_name,
		subject_name: subject_name,
		date: date,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;

};

// create a user
Blockchain.prototype.createNewTransactionUser = function(full_name, last_name, birthday, role, user_name, user_id, description) {
	const user_name_hash = sha256(user_name);
	const user_id_hash = sha256(user_id);
	const newTransaction = {
		full_name: full_name,
		last_name: last_name,
		birthday: birthday,
		role: role,
		user_hash: user_name_hash,
		user_id_hash: user_id_hash,
		description: description,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;

};

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

// POW buyu nonce = 0 gesen toog negeer nemegduulj sha256-r encrypte hiij ehnii 4 temdegt
// 0000 bwal nonce oldoloo gej uzeed blockiig nemne
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	// bitcoin.hashBlock = function(previousBlockHash, currentBlockData, nonce);
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000'){
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};

//chain valid bga esehiig shalgah 
//buh block-r guij currentBlock-n hash omnoh block-m hashtai adilhan bh ystoi!
Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;

	for (var i = 1;  i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);

		// console.log("========================");
		// console.log(validChain);
		console.log("prevBlock: "+prevBlock['hash']);
		// console.log("transactions: "+currentBlock['transactions']);
		 console.log("currentBlock: "+currentBlock['hash']);
		// console.log("nonce: "+currentBlock['nonce']);
		if (blockHash.substring(0, 4) !=='0000') validChain = false;

		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0]; //genesisBlock gedeg n hamgiin ahnii block buyu previousBlockHash-gui block
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};

//blockHash-r tuhain block-g awah
Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if(block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};

Blockchain.prototype.getTransaction = function(transactionId){
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			}
		});
	});
	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};

Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient ===address){
				addressTransactions.push(transaction);
			}
		});
	});

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if(transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};

Blockchain.prototype.getInstitution = function() {
	const addressTransactions = [];
	const teachers = [];
	const students = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(typeof transaction.institution != 'undefined'){
				addressTransactions.push(transaction);
			}
			if(transaction.role == 'teacher'){
				teachers.push(transaction);
			}
			if(transaction.role == 'student'){
				students.push(transaction);
			}
			
			
		});
	});

	
	return {
		institutions: addressTransactions,
		teachers: teachers,
		students: students		
	};
};

Blockchain.prototype.hashLogin = function(user_key) {
	const hash = sha256(user_key);
	return hash;
};

Blockchain.prototype.getUserData = function(user_id_hash){
	const userData = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.user_id === user_id_hash) {
				userData.push(transaction);
			}
		});
	});
	return {
		userData
	};
};

Blockchain.prototype.getUserInfo = function(user_id_hash){
	let userData = null;
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.user_id_hash === user_id_hash) {
				userData=transaction;
			}
		});
	});
	return {
		userData
	};
};


module.exports = Blockchain;
