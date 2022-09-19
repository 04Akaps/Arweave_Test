const Arweave = require("arweave");
const key = require("./key.json");

// Trsnaction을 사용하는데에 가스비가 arToken을 들어가기 떄문에 docker를 실행하여 image를 따와야 한다.
// https://github.com/textury/arlocal

// 그후 local환경에서 Test

// SDK docs : https://github.com/ArweaveTeam/arweave-js
const arweave = Arweave.init({
  host: "127.0.0.1",
  port: 1984,
  protocol: "http",
});

var imageUrl =
  "https://arweave.net/--56hNXqVLfji9q_qNfUowCv26UVlQlbv0jFfRogj6s?ext=png";
let metadata = `{
        "name": "Bird Ape King",
        "symbol": "NFTPro",
        "description": "Ape Bird Punk created by a BAD AI. Mixing genes of birds and apes and trying to produce a high conscious being that could patrol difficult planets. Owning this NFT has a 3 % more rewards on serpent academy.Coming soon.",
        "seller_fee_basis_points": 1000,
        "image": "${imageUrl}",
        "attributes": [{
            "trait_type": "Eyes",
            "value": "Red Glow"
        }, {
            "trait_type": "Status",
            "value": "Ape Bird"
        }],
        "properties": {
            "files": [{
                "uri": "${imageUrl}",
                "type": "image/png"
            }],
            "category": "image",
            "creators": [{
                "address": "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9",
                "verified": true,
                "share": 100
            }]
        }
    }`;

const init = async () => {
  const key = await arweave.wallets.generate();
  const address = await arweave.wallets.jwkToAddress(key);

  console.log("address", address);

  await arweave.api.get(`/mint/${address}/${arweave.ar.arToWinston("10")}`);

  const transaction = await arweave.createTransaction({
    data: "hoijn",
  });

  await arweave.transactions.sign(transaction, key);
  let uploader = await arweave.transactions.getUploader(transaction);

  while (!uploader.isComplete) {
    await uploader.uploadChunk();

    // console.log(uploader);
    // console.log(
    //   `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    // );
  }
  // { decode: true, string: true }
  arweave.transactions
    .get(transaction.id, { decode: true })
    .then((data) => console.log("data", data));

  // https://viewblock.io/arweave/tx/SjeZog7tZfsSDUkobwJyiA5rbtnvui2mTNt1kEzORiE
  // https://cclklr6ldqca7ty6tlg2pyabxntrckgrgjrelnxejr4gmt5hpltq.arweave.net/EJalx8scBA_PHprNp-ABu2cRKNEyYkW25Ex4Zk-neuc

  // hbv3fi7ao5cfc88hes5tgbzdts0fpezr5e0vnnutw739auem8q1jzz87pg9a41qv
  // 2hDD2pZnGojsDZ1CD2NYyAJCRPN6QVGWHt7jWyIkl3E
  // Uint8Array(5) [ 104, 111, 105, 106, 110 ]

  // metadata = metadata.trim();
  // const metadataRequest = JSON.parse(JSON.stringify(metadata));
  // const metadataTransaction = await arweave.createTransaction({
  //   data: metadataRequest,
  // });
  // metadataTransaction.addTag("Content-Type", "application/json");
  // // const key = await arweave.wallets.generate();
  // console.log(" ");
  // console.log("-----------------------------");
  // console.log(" ");
  // await arweave.transactions.sign(
  //   metadataTransaction,
  //   "Your Areave Wallet Json File, must Need Arb Token For Fee"
  // );
  // console.log("https://arweave.net/" + metadataTransaction.id);
  // let response = await arweave.transactions.post(metadataTransaction);
  // console.log(response);
};

init();
