const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('@noble/secp256k1');

const keyPairs = {};
const balances = {};

for (let i = 0; i < 3; i++) {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const priString = secp.utils.bytesToHex(privateKey).slice(-40);
  const pubString = secp.utils.bytesToHex(publicKey).slice(-40);

  keyPairs[priString] = pubString;
  balances[pubString] = Math.ceil(Math.random() * 100);
}

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  const senderPubKey = keyPairs[sender];
  balances[senderPubKey] -= amount;
  balances[recipient] = (balances[recipient] || 0) + + amount;
  res.send({ balance: balances[senderPubKey] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(keyPairs);
  console.log(balances);
});
