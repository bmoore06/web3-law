import Web3 from "web3";
import LawStorage from "./abis/LawStorage.json";

export default class LawContractInterface {
  constructor(web3Instance) {
    this.useDefaultProvider = !web3Instance;
    this.web3Instance = web3Instance;
  }

  get interface() {
    const web3 = this.getWeb3();
    const contractAddress = "0xFE62DA7cc282af410B18988294e6a98B1a178272";
    return new web3.eth.Contract(LawStorage.abi, contractAddress);
  }

  getWeb3() {
    if (!this.useDefaultProvider) return this.web3Instance;
    const provider = new Web3.providers.HttpProvider(
      `${process.env.REACT_APP_INFURA_API_URL}`
    );
    return new Web3(provider);
  }
}

/*
 Deploying 'LawStorage'
 ----------------------
 > transaction hash:    0xaa7ed985ccd07a69a2d625c540b4247f3f1f9d776abe1e3578e1326736da73fd
 > Blocks: 0            Seconds: 0
 > contract address:    0xFE62DA7cc282af410B18988294e6a98B1a178272
 > account:             0x5f2a4071FfCdA74B343A8F1fc921130Bd410a90e
*/
