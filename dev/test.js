const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

// bitcoin.createNewBlock(2389, 'OINA90SDNF90N', '90ANSD9F0N9009N');
// bitcoin.createNewTransaction(100, 'ALEX90SDNF90N', 'JENN0SD9F0N909A9');

const previousBlockHash = 'OINA90SDNF90NOINA90SDNF90N';
const bc1 = {
chain: [
{
index: 1,
timestamp: 1533288914903,
transactions: [ ],
nonce: 100,
hash: "0",
previousBlockHash: "0"
},
{
index: 2,
timestamp: 1533288959413,
transactions: [
{
amount: 80,
sender: "FUEINRNNFANSDSDFK345",
recipient: "FNIWPIENTNSDSDFK3FAW",
transactionId: "8e869920970011e881d3d30567fdaad6"
},
{
amount: 90,
sender: "FUEINRNNFANSDSDFK345",
recipient: "FNIWPIENTNSDSDFK3FAW",
transactionId: "92eba0f0970011e881d3d30567fdaad6"
}
],
nonce: 55992,
hash: "00001de19cf2f0c8dfd536efb9a90e5906cd7f54a51d44155caf050028fd64f9",
previousBlockHash: "0"
}
],
pendingTransactions: [
{
amount: 12.5,
sender: "00",
recipient: "869cfe70970011e881d3d30567fdaad6",
transactionId: "a12bda40970011e881d3d30567fdaad6"
}
],
currentNodeUrl: "http://localhost:3002",
networkNodes: [ ]
};

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 59112));
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
blockchain = bc1.chain;

  // console.log('check: ' , chainIsValid1(bc1.chain));
 console.log('VALID: ' , bitcoin.chainIsValid(bc1.chain));
 // console.log(bitcoin);
