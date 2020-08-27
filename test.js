const { Managers, Transactions, Identities } = require("@arkecosystem/crypto");

const { MultiSignatureSigner } = require("./dist");

const main = async () => {
	Managers.configManager.setFromPreset("devnet");
	Managers.configManager.setHeight(100000000);

	const wallet1Address = "DBMvn8HxVMqTcahgsQzbDs1PDxdaWNWRvs";
	const wallet1PublicKey = "02700109d1153da79cf54ddab5726b615929418cf464023a466b624fa6a2ac745d";
	const wallet1Passphrase = "busy swim online private allow car pulse step same mushroom inform digital";

	const wallet2Address = "DLXjCPRR893x7qS7RAd5AwWBrXqbDfK2cd";
	const wallet2PublicKey = "03c10a75da7067f30e669771e3d09c6ba8881383b7cb5adf37d6aefa89261aae52";
	const wallet2Passphrase = "rough issue nuclear speak flavor enlist health spread sketch box funny similar";

	const wallet3Address = "DSbnwWY3yGJQqsm2SVZ7WWPg4Uxky7UkjJ";
	const wallet3PublicKey = "0272280cc3c783377b38e8693c562a5cf3427e28ffcfe3d0bed9d6748d2673a832";
	const wallet3Passphrase = "shrimp boy mirror razor rail notice soldier afford ordinary social bunker advance";

	// console.log(
	// 	Transactions.BuilderFactory.multiSignature()
	// 		.multiSignatureAsset({
	// 			publicKeys: [wallet1PublicKey, wallet2PublicKey, wallet3PublicKey],
	// 			min: 2,
	// 		})
	// 		.senderPublicKey(wallet1PublicKey)
	// 		.multiSign(wallet1Passphrase, 0)
	// 		.multiSign(wallet2Passphrase, 1)
	// 		.multiSign(wallet3Passphrase, 2)
	// 		.nonce(1)
	// 		.sign(wallet1Passphrase)
	// 		.build()
	// 		.toJson(),
	// );

	const multiSignature = {
		min: 2,
		publicKeys: [
			"03bc27e99693eba0831ae4f163e8d1ca33e7f4cfc7748e0e651101cccde1815e1a",
			"02a7824e683de4bd5ce885f39bad8c352a1077ac41e1bbbbf72b78695e78221e8d",
		],
	};

	const baseTransaction = Transactions.BuilderFactory.transfer()
		.nonce(15)
		.amount(1)
		.recipientId("DRsenyd36jRmuMqqrFJy6wNbUwYvoEt51y")
		.vendorField("sent from sdk");

	let transaction = MultiSignatureSigner.sign(baseTransaction, multiSignature);

	transaction = MultiSignatureSigner.addSignature(
		transaction,
		multiSignature,
		Identities.Keys.fromPassphrase("bribri"),
	);

	transaction = MultiSignatureSigner.addSignature(
		transaction,
		multiSignature,
		Identities.Keys.fromPassphrase("roro"),
	);

	console.log(transaction);
	console.log(JSON.stringify(transaction));
};

main();
