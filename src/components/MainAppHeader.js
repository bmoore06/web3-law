import React from "react";

export default class MainAppHeader extends React.Component {
  render() {
    return (
      <div style={{ display: "flex", alignItems: "center", height: "70px", backgroundColor: "#5C10CD" }}>
        <a style={{ margin: "0 0 0 30px", color: "silver", fontSize: "26px" }}>web3-law</a>
      </div>
    );
  }
}
