import React from "react";
import { create } from "ipfs-http-client";

// const ipfs = create("https://ipfs.infura.io:5001");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default class MainAppBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = { buffer: null };
  }

  // example hash: "QmcUwsqbsRpEzjTsqv8UC9Wp1Tfw3ziFk6iDZW6k8KciwX"
  // example url: https://ipfs.infura.io/ipfs/QmcUwsqbsRpEzjTsqv8UC9Wp1Tfw3ziFk6iDZW6k8KciwX
  ipfsUpload = () => {
    ipfs
      .add(this.state.buffer)
      .then(response => console.log({ response, cid: response.cid }))
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

  render() {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.processFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}
