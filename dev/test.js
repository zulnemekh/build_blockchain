const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

// bitcoin.createNewBlock(2389, 'OINA90SDNF90N', '90ANSD9F0N9009N');
// bitcoin.createNewTransaction(100, 'ALEX90SDNF90N', 'JENN0SD9F0N909A9');

const previousBlockHash = 'OINA90SDNF90NOINA90SDNF90N';
const currentBlockData = [
	{
		amount: 10,
		sender: '90ANSD9F0N9009N',
		recipient: '10NA90SDNF90NR10N'
	},
	{
		amount: 30,
		sender: '300ANSD9F0N9009N',
		recipient: 'OINA90SDNF90NR30N'
	},
	{
		amount: 200,
		sender: '200ANSD9F0N9009N',
		recipient: 'OINA90SDNF90N200N'
	},
];


// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 59112));
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
console.log(bitcoin);
