const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

// bitcoin.createNewBlock(2389, 'OINA90SDNF90N', '90ANSD9F0N9009N');
// bitcoin.createNewTransaction(100, 'ALEX90SDNF90N', 'JENN0SD9F0N909A9');

const previousBlockHash = 'OINA90SDNF90NOINA90SDNF90N';
const bc1 = {
chain: [
{
index: 1,
timestamp: 1533438639254,
transactions: [ ],
nonce: 100,
hash: "0",
previousBlockHash: "0"
},
{
index: 2,
timestamp: 1533439192075,
transactions: [ ],
nonce: 18140,
hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
previousBlockHash: "0"
},
{
index: 3,
timestamp: 1533439404044,
transactions: [
{
amount: 12.5,
sender: "00",
recipient: "2147e360985d11e8804669ff30d45fe8",
transactionId: "6ae28ce0985e11e8804669ff30d45fe8"
},
{
amount: 10,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "cd2a2840985e11e8804669ff30d45fe8"
},
{
amount: 20,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "dd408120985e11e8804669ff30d45fe8"
},
{
amount: 30,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "e0d603f0985e11e8804669ff30d45fe8"
}
],
nonce: 52966,
hash: "000050e0e99aeb0f61f5a9f065cd659ba9c39b0b7dcdc7629a48a6f24bda8a05",
previousBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
},
{
index: 4,
timestamp: 1533439446257,
transactions: [
{
amount: 12.5,
sender: "00",
recipient: "2147e360985d11e8804669ff30d45fe8",
transactionId: "e924c910985e11e8804669ff30d45fe8"
},
{
amount: 40,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "f63f9530985e11e8804669ff30d45fe8"
},
{
amount: 50,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "f8744f80985e11e8804669ff30d45fe8"
},
{
amount: 60,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "fc5d7090985e11e8804669ff30d45fe8"
},
{
amount: 70,
sender: "NFAFD123LSDFJSDF",
recipient: "RECFD123LSDFJSDF",
transactionId: "fe953820985e11e8804669ff30d45fe8"
}
],
nonce: 17869,
hash: "000047caf710d011044db9b83d6ed0e689710a138bd0b4d7e5ee0fb299650aa8",
previousBlockHash: "000050e0e99aeb0f61f5a9f065cd659ba9c39b0b7dcdc7629a48a6f24bda8a05"
}
],
pendingTransactions: [
{
amount: 12.5,
sender: "00",
recipient: "2147e360985d11e8804669ff30d45fe8",
transactionId: "024c73c0985f11e8804669ff30d45fe8"
}
],
currentNodeUrl: "http://localhost:3001",
networkNodes: [ ]
};

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 59112));
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
blockchain = bc1.chain;

  // console.log('check: ' , chainIsValid1(bc1.chain));
 console.log('VALID: ' , bitcoin.chainIsValid(bc1.chain));
 // console.log(bitcoin);
