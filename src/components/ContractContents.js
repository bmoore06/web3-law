import React from "react";
import LawContractInterface from "../LawContractInterface";

export default class MainAppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractClause: null,
      contractHash: null
    };
  }

  async componentWillMount() {
    await this.getContractState();
  }

  getContractState = async () => {
    const contractInterface = new LawContractInterface().interface;
    const currentState = await contractInterface.methods.retrieve().call();
    this.setState({
      contractClause: currentState[0],
      contractHash: currentState[1]
    });
  };

  render() {
    const { contractHash, contractClause } = this.state;
    return (
      <div style={{ margin: "50px 10px" }}>
        <div
          style={{ height: "3px", width: "800px", backgroundColor: "#5C10CD" }}
        />
        <div style={{ fontWeight: "600" }}>Current Contract State:</div>
        <div>Clause: {!!contractClause && contractClause}</div>
        <div>IPFS Hash: {!!contractHash && contractHash}</div>
        <div>
          File:{" "}
          {!!contractHash && (
            <img src={`https://ipfs.infura.io/ipfs/${contractHash}`} />
          )}
        </div>
      </div>
    );
  }
}
