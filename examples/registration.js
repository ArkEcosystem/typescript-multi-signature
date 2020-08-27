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

const wallet3 = {
	address: "",
	publicKey: "",
	passphrase: "",
};

const multiSignatureAsset = {
	min: 3,
	publicKeys: [wallet1.publicKey, wallet2.publicKey, wallet3.publicKey],
};

const main = async () => {
	Managers.configManager.setFromPreset("devnet");
	Managers.configManager.setHeight(100000000);

	const baseTransaction = Transactions.BuilderFactory.multiSignature()
		.nonce(2)
		.senderPublicKey(wallet1.publicKey)
		.multiSignatureAsset(multiSignatureAsset);

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

	transaction = MultiSignatureSigner.addSignature(
		transaction,
		multiSignatureAsset,
		Identities.Keys.fromPassphrase(wallet3.passphrase),
	);

	// Sign the transaction like a normal transaction
	transaction = MultiSignatureSigner.addSignature(
		transaction,
		multiSignatureAsset,
		Identities.Keys.fromPassphrase(wallet1.passphrase),
	);

	console.log("SIGNATURE: " + Transactions.Verifier.verifyHash(transaction));
	console.log("SIGNATURES: " + Transactions.Verifier.verifySignatures(transaction, multiSignatureAsset));
	console.log(JSON.stringify(transaction));
};

main();
