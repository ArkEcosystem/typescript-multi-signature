const { Managers, Transactions, Identities } = require("@arkecosystem/crypto");

const { MultiSignatureSigner } = require("../dist");

const wallet1 = {
	address: "",
	publicKey: "",
	passphrase: "",
};

const wallet2 = {
	address: "",
	publicKey: "",
	passphrase: "",
};

const multiSignatureAsset = {
	min: 2,
	publicKeys: [wallet1.publicKey, wallet2.publicKey],
};

const main = async () => {
	Managers.configManager.setFromPreset("devnet");
	Managers.configManager.setHeight(100000000);

	const baseTransaction = Transactions.BuilderFactory.transfer()
		.nonce(18)
		.amount(1)
		.recipientId("DRsenyd36jRmuMqqrFJy6wNbUwYvoEt51y")
		.vendorField("sent from sdk");

	let transaction = MultiSignatureSigner.sign(baseTransaction, multiSignatureAsset);

	transaction = MultiSignatureSigner.addSignature(
		transaction,
		multiSignatureAsset,
		Identities.Keys.fromPassphrase(wallet1.passphrase),
	);

	transaction = MultiSignatureSigner.addSignature(
		transaction,
		multiSignatureAsset,
		Identities.Keys.fromPassphrase(wallet2.passphrase),
	);

	// console.log(transaction);
	console.log(JSON.stringify(transaction));
};

main();
