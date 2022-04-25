import React from "react";
import AdminPage from "./AdminPage";
import SearchPage from "./SearchPage";
import ContractContents from "./ContractContents";

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false
    };
  }

  togglePage = () => this.setState({ admin: !this.state.admin });

  render() {
    const { admin } = this.state;

    return (
      <div style={mainAppStyles}>
        <div
          onClick={this.togglePage}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "0 100px 0 0"
          }}
        >
          <span
            style={{
              backgroundColor: "#cfc6dd",
              fontWeight: "800",
              borderRadius: "4px"
            }}
          >
            {!!admin ? "SEARCH PAGE" : "ADMIN LOGIN"}
          </span>
        </div>
        <div style={{ minHeight: "300px" }}>
          {admin && <AdminPage />}
          {!admin && <SearchPage />}
        </div>
        <ContractContents />
      </div>
    );
  }
}

const mainAppStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "80px 0 0 100px"
};
