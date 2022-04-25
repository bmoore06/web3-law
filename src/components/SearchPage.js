import React from "react";
import Web3 from "web3";
import abiDecoder from "abi-decoder";
import LawStorage from "../abis/LawStorage.json";
import LawContractInterface from "../LawContractInterface";

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      contractInterface: null,
      searchClause: null,
      searchResult: null
    };
  }

  async componentDidMount() {
    const lawContractInterface = new LawContractInterface();
    this.setState({
      web3: lawContractInterface.getWeb3(),
      contractInterface: lawContractInterface.interface
    });
  }

  setSearchClause = event =>
    this.setState({ searchClause: event.target.value });

  onSearch = async event => {
    event.preventDefault();
    const { searchClause, contractInterface, web3 } = this.state;
    const searchHash = Web3.utils.sha3(searchClause);

    const pastEvents = await contractInterface.getPastEvents("LawUpdated", {
      // filter: { clause: searchClause }, // TODO
      fromBlock: 0,
      toBlock: "latest"
    });
    const relevantEvents = pastEvents.filter(
      event => event.raw.topics[1] === searchHash
    );
    console.log({ pastEvents, relevantEvents });
    if (!relevantEvents[0]) {
      this.setState({ searchResult: null });
      return;
    }

    const transaction = await web3.eth.getTransaction(
      relevantEvents[0].transactionHash
    );
    abiDecoder.addABI(LawStorage.abi);
    const decodedTx = abiDecoder.decodeMethod(transaction.input);
    console.log({ decodedTx });
    this.setState({ searchResult: decodedTx.params[1].value });
  };

  render() {
    const { searchResult } = this.state;

    return (
      <div style={searchBodyStyles}>
        <form onSubmit={this.onSearch}>
          <div style={{ fontWeight: "600" }}>Search Law by Clause:</div>
          <input type="text" onChange={this.setSearchClause} />
          <input type="submit" />
        </form>
        <div style={{ margin: "25px 0 70px 0", fontWeight: "600" }}>
          Search Result:
          {!!searchResult && (
            <img src={`https://ipfs.infura.io/ipfs/${searchResult}`} />
          )}
        </div>
      </div>
    );
  }
}

const searchBodyStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "80px 0 0 100px"
};
