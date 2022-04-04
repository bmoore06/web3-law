import React from "react";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import abiDecoder from "abi-decoder";
import LawStorage from "../abis/LawStorage.json";

// const ipfs = create("https://ipfs.infura.io:5001");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

export default class MainAppBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: true,
      buffer: null,
      lawHash: null,
      clause: null,
      account: null,
      contract: null,
      searchClause: null,
      searchResult: null
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please configure metamask.");
    }
  }

  // get the account (my test private key: 4afb0e340c78c2ba098d700baec07a359f2669cf00db909cb569ac54c051d2de)
  // get the network
  // get the Smart Contract
  //  -> ABI: LawStorage.abi
  //  -> Address: LawStorage.networks[networkId].address
  // get the lawHash
  async loadBlockchainData() {
    // this will be the account logged into MetaMask
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = LawStorage.networks[networkId];
    if (networkData) {
      const contract = new web3.eth.Contract(
        LawStorage.abi,
        networkData.address
      );
      this.setState({ contract });
      const contractVals = await contract.methods.retrieve().call();
      this.setState({ clause: contractVals[0], lawHash: contractVals[1] });
    } else {
      window.alert("smart contract not deployed to detected network");
    }
  }

  // example hash: "QmW4YRe1LJcR3BNcguPfjzKyhbUQaELhFuU6GmASkeMWD3"
  // example url: https://ipfs.infura.io/ipfs/QmW4YRe1LJcR3BNcguPfjzKyhbUQaELhFuU6GmASkeMWD3
  ipfsUpload = () => {
    ipfs
      .add(this.state.buffer)
      .then(response => {
        const lawHash = response.path;
        const clause = this.state.clause;
        this.state.contract.methods
          .store(clause, lawHash)
          .send({ from: this.state.account })
          .then(result => this.setState({ lawHash }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  onSubmit = event => {
    event.preventDefault();
    !!this.state.buffer
      ? this.ipfsUpload()
      : alert("Please choose a file to upload");
  };

  processFile = event => {
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  setClause = event => this.setState({ clause: event.target.value });

  onSearch = async event => {
    event.preventDefault();
    const { searchClause, contract } = this.state;
    const searchHash = window.web3.utils.sha3(searchClause);
    const pastEvents = await contract.getPastEvents("LawUpdated", {
      // filter: { clause: searchClause }, // TODO
      fromBlock: 0,
      toBlock: "latest"
    });
    const relevantEvents = pastEvents.filter(
      event => event.raw.topics[1] === searchHash
    );

    if (!relevantEvents[0]) return;

    const transaction = await window.web3.eth.getTransaction(
      relevantEvents[0].transactionHash
    );
    abiDecoder.addABI(LawStorage.abi);
    const decodedTx = abiDecoder.decodeMethod(transaction.input);
    console.log(decodedTx);
    this.setState({ searchResult: decodedTx.params[1].value });

    // .then(async events => {
    //   console.log({ events });
    //   const relevantEvents = events.filter(
    //     event => event.raw.topics[1] === searchHash
    //   );
    //   console.log({ relevantEvents });
    //   // const test1 = window.web3.utils.hexToUtf8(
    //   //   events[0].returnValues.clause
    //   // );
    //   // const test2 = window.web3.utils.hexToUtf8(
    //   //   events[0].returnValues.lawHash
    //   // );
    //   // console.log({ test1, test2 });
    //   const transaction = await window.web3.eth.getTransaction(
    //     events[0].transactionHash
    //   );

    //   // const test1 = window.web3.eth.abi.decodeParameters(
    //   //   ["string", "string"],
    //   //   transaction.input.toString()
    //   // );

    //   abiDecoder.addABI(LawStorage.abi);
    //   const test1 = abiDecoder.decodeMethod(transaction.input);
    //   console.log(test1);

    //   // window.web3.eth.getTransactionReceipt(
    //   //   events[0].transactionHash,
    //   //   function(e, receipt) {
    //   //     console.log({ receipt });
    //   //     console.log(receipt.logs);
    //   //     const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
    //   //     console.log({ decodedLogs });
    //   //     const temp1 = window.web3.utils
    //   //       .toBN(decodedLogs[0].events[0].value)
    //   //       .toString();
    //   //     // const decodedParams = window.web3.eth.abi.decodeParameters(
    //   //     //   [
    //   //     //     { name: "clause", type: "string" },
    //   //     //     { name: "lawHash", type: "string" }
    //   //     //   ],
    //   //     //   temp1
    //   //     // );
    //   //     // console.log({ decodedParams });
    //   //     // console.log(window.web3.utils.toAscii(decodedLogs[0].events[0].value));
    //   //   }
    //   // );
    //   // const transaction = await window.web3.eth.getTransaction(relevantEvents[0].transactionHash);
    //   // console.log({transaction});
    //   // window.web3.eth.getTransaction(events[0].transactionHash).then(console.log);
    //   // const test = window.web3.utils.hexToAscii(events[0].raw.topics[1]);
    //   // console.log({ test });
    // });
  };

  setSearchClause = event =>
    this.setState({ searchClause: event.target.value });

  togglePage = () => this.setState({ admin: !this.state.admin, searchResult: null });

  render() {
    const { admin, account, clause, lawHash, searchResult } = this.state;
    console.log({ state: this.state });
    return (
      <div style={appBodyStyles}>
        <div
          onClick={this.togglePage}
          style={{ width: "fit-content", backgroundColor: "silver" }}
        >
          SWITCH PAGE
        </div>
        <div>Account Signed in: {!!account && account}</div>
        {admin && (
          <>
            <form onSubmit={this.onSubmit}>
              <div>Clause:</div>
              <input type="text" onChange={this.setClause} />
              <input type="file" onChange={this.processFile} />
              <input type="submit" />
            </form>
            <div style={{ marginTop: "80px" }}>
              <div>Clause: {!!clause && clause}</div>
              <div style={{ marginTop: "15px" }}>
                Hash: {!!lawHash && lawHash}
              </div>
              <div style={{ marginTop: "15px" }}>Document:</div>
              {!!lawHash && (
                <img src={`https://ipfs.infura.io/ipfs/${lawHash}`} />
              )}
            </div>
          </>
        )}
        {!admin && (
          <>
            <form onSubmit={this.onSearch}>
              <div>Search Law by Clause:</div>
              <input type="text" onChange={this.setSearchClause} />
              <input type="submit" />
            </form>
            <div style={{ marginTop: "25px" }}>Search Result:</div>
            {!!searchResult && (
              <img src={`https://ipfs.infura.io/ipfs/${searchResult}`} />
            )}
          </>
        )}
      </div>
    );
  }
}

const appBodyStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "80px 0 0 100px"
};