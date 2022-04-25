import React from "react";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import LawContractInterface from "../LawContractInterface";

// const IPFS = create("https://ipfs.infura.io:5001");
const IPFS = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      lawHash: null,
      clause: null,
      account: null
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadAccount();
  }

  async loadWeb3(){
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

  async loadAccount(){
    // this will be the account logged into MetaMask
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  };

  ipfsUpload = () => {
    IPFS.add(this.state.buffer)
      .then(response => {
        const lawHash = response.path;
        const clause = this.state.clause;
        const contractInterface = new LawContractInterface(window.web3)
          .interface;
        contractInterface.methods
          .store(clause, lawHash)
          .send({ from: this.state.account })
          .then(result => this.setState({ lawHash }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  postLaw = event => {
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

  render() {
    const { account } = this.state;

    return (
      <div style={adminBodyStyles}>
        <div>Account Signed in: {!!account && account}</div>
        <form onSubmit={this.postLaw}>
          <div>Clause:</div>
          <input type="text" onChange={this.setClause} />
          <input type="file" onChange={this.processFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

const adminBodyStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "80px 0 0 100px"
};
