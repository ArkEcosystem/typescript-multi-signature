import { Interfaces } from "@arkecosystem/crypto";

export interface MultiSignatureTransaction {
	data: Interfaces.ITransactionData;
	multiSignature: Interfaces.IMultiSignatureAsset;
}
