import { Transactions, Interfaces, Identities, Enums } from "@arkecosystem/crypto";

import { MultiSignatureTransaction } from "./contracts";
import { PendingMultiSignatureTransaction } from "./transaction";

export class MultiSignatureSigner {
	public static async addSignature(
		transaction: MultiSignatureTransaction,
		primaryKeys: Interfaces.IKeyPair,
		secondaryKeys?: Interfaces.IKeyPair,
	): Promise<MultiSignatureTransaction> {
		const pendingMultiSignature = new PendingMultiSignatureTransaction(transaction);

		if (!pendingMultiSignature.isMultiSignatureReady(true)) {
			const index: number = transaction.multiSignature.publicKeys.indexOf(primaryKeys.publicKey);

			if (index === -1) {
				throw new Error(`The public key [${primaryKeys.publicKey}] is not associated with this transaction.`);
			}

			Transactions.Signer.multiSign(transaction.data, primaryKeys, index);

			transaction.data.signatures = transaction.data.signatures.filter(
				(value, index, self) => self.indexOf(value) === index,
			);
		} else if (pendingMultiSignature.needsWalletSignature(primaryKeys.publicKey)) {
			Transactions.Signer.sign(transaction.data, primaryKeys);

			if (secondaryKeys) {
				Transactions.Signer.secondSign(transaction.data, secondaryKeys);
			}

			transaction.data.id = Transactions.Utils.getId(transaction.data);
		}

		return transaction;
	}

	// The first argument should be a TransactionBuilder but we have no proper type to hint that.
	public static async sign(transaction: any, mnemonic: string, senderPublicKey?: string) {
		const publicKeyIndex: number = transaction.multiSignature.publicKeys.indexOf(senderPublicKey);

		transaction.senderPublicKey(senderPublicKey);

		if (publicKeyIndex > -1) {
			transaction.multiSign(mnemonic, publicKeyIndex);
		} else if (transaction.data.type === Enums.TransactionType.MultiSignature && !transaction.data.signatures) {
			transaction.data.signatures = [];
		}

		if (!transaction.data.senderPublicKey) {
			transaction.senderPublicKey(Identities.PublicKey.fromMultiSignatureAsset(transaction.multiSignature));
		}

		const data =
			transaction.data.type === Enums.TransactionType.MultiSignature
				? transaction.getStruct()
				: transaction.build().toJson();

		if (!data.signatures) {
			data.signatures = [];
		}

		return { data, multiSignature: transaction.multiSignature };
	}
}
