import React from "react";
import { create } from "ipfs-http-client";

// const ipfs = create("https://ipfs.infura.io:5001");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

export default class MainAppBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = { buffer: null, lawHash: null, clause: null };
  }

  // example hash: "QmW4YRe1LJcR3BNcguPfjzKyhbUQaELhFuU6GmASkeMWD3"
  // example url: https://ipfs.infura.io/ipfs/QmW4YRe1LJcR3BNcguPfjzKyhbUQaELhFuU6GmASkeMWD3
  ipfsUpload = () => {
    ipfs
      .add(this.state.buffer)
      .then(response => this.setState({ lawHash: response.path }))
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

  render() {
    return (
      <div style={appBodyStyles}>
        <form onSubmit={this.onSubmit}>
          <div>Clause:</div>
          <input type="text" onChange={this.setClause} />
          <input type="file" onChange={this.processFile} />
          <input type="submit" />
        </form>
        <div style={{ marginTop: "80px" }}>
          <div>Clause: {!!this.state.clause && this.state.clause}</div>
          <div style={{ marginTop: "15px" }}>
            Hash: {!!this.state.lawHash && this.state.lawHash}
          </div>
          <div style={{ marginTop: "15px" }}>Document:</div>
          {!!this.state.lawHash && (
            <img src={`https://ipfs.infura.io/ipfs/${this.state.lawHash}`} />
          )}
        </div>
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
