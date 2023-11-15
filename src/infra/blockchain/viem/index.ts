import {
	FallbackTransport,
	HttpTransport,
	WebSocketTransport,
	createPublicClient,
	createWalletClient,
	fallback,
	getContract,
	http,
	webSocket,
} from "viem";
import {
	VIEM_PROVIDERS,
} from "../../../config";
import { USDC_TOKEN_CONTRACT_ABI } from "./contract/usdcTokenContract/abi";
import { BATCH_CALL_ABI } from "./contract/batch_call_contract/abi";
import { FUNDING_ABI } from "./contract/funding_contract/abi";
import { OPEN_POSITION_ABI } from "./contract/open_position_contract/abi";
import { POOL_ABI } from "./contract/pool_contract/abi";
import { CHAINLINK_ABI } from "./contract/chainlink_contract/abi";
import { PROFIT_SHARE_ABI } from "./contract/profit_share/abi";
import { EDIT_POSITION_ABI } from "./contract/edit_position/abi";

export const getTransport = (): FallbackTransport => {
	const transports: (WebSocketTransport | HttpTransport)[] = [];
	VIEM_PROVIDERS.forEach((el: string) => {
		if (el.startsWith("ws")) {
			transports.push(webSocket(el));
		} else {
			transports.push(http(el));
		}
	});
	return fallback(transports);
};
export const viemPublicClient = createPublicClient({
	batch: {
		multicall: {
			wait: 10,
		},
	},
	transport: getTransport(),
});
export const viemWalletClient = createWalletClient({
	transport: getTransport(),
});

