import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Table from "react-bootstrap/Table";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";


function Register() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata(false);
  }, []);
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [tableData, setTableData] = useState({});
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [place, setPlace] = useState();
  const [addMethod, setAddMethod] = useState();
  const [subTitle, setSubTitle] = useState("");
  const [showMain, setShowMain] = useState(true);
  const [type, setType] = useState("");
  const [control, setControl] = useState("");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async (have) => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
      const supplychain = new web3.eth.Contract(
        SupplyChainABI.abi,
        SupplyChainABI.address
      );
      if (have) cilickOnCard(control, type, addMethod, subTitle);
      setSupplyChain(supplychain);
      setloader(false);
  };

  if (loader) {
    return (
      <div className="spinner-button">
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      </div>
    );
  }

  const cilickOnCard = async (ctrl, type, addMethod, title) => {
    setAddMethod(addMethod);
    setSubTitle(title);
    setShowMain(false);
    setType(type);
    setControl(ctrl);
    var i;
    const controls = await SupplyChain.methods?.[ctrl]().call();
    const records = {};
    for (i = 0; i < controls; i++) {
      records[i] = await SupplyChain.methods?.[type](i + 1).call();
    }
    setTableData(records);
  };

  const handlerChangePlace = (event) => {
    setPlace(event.target.value);
  };

  const handlerChangeName = (event) => {
    setName(event.target.value);
  };

  const handlerChangeAddress = (event) => {
    setAddress(event.target.value);
  };
  const handlerSubmit = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods?.[addMethod](
        address,
        name,
        place
      ).send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata(true);
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  return (
    <>
      {showMain ? (
        <CardGroup>
          <Card>
            
            <Card.Body  onClick={() =>
                  cilickOnCard(
                    "rawMaterialSupplierCtr",
                    "getRMS",
                    "addRawMaterialSupplier",
                    "Raw Material Suppliers"
                  )
                }>
              { <Card.Title>Raw Material Suppliers</Card.Title> }
              <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/4866/4866608.png"
            />
            </Card.Body>
          </Card>
          <Card>
            
            <Card.Body
            onClick={() =>
              cilickOnCard(
                "manufacturerCtr",
                "getManufacturer",
                "addManufacturer",
                "Manufacturers"
              )
            }>
              <Card.Title>Manufacturers</Card.Title> 
              <Card.Img
              variant="top"
              src="https://thumbs.dreamstime.com/b/simple-minimal-modern-line-icon-robotic-equipment-drug-manufacturing-vector-blue-outline-pictogram-isolated-transparent-261605932.jpg"
            />
              
            </Card.Body>
          </Card>
          <Card>
            
            <Card.Body onClick={() =>
                  cilickOnCard(
                    "distributorCtr",
                    "getDistributor",
                    "addDistributor",
                    "Distributors"
                  )
                }>
               <Card.Title>Distributors</Card.Title> 
                <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/8383/8383032.png"
            />
            </Card.Body>
          </Card>
          <Card>
            
            <Card.Body onClick={() =>
                  cilickOnCard("retCtr", "getRetailer", "addRetailer", "Retailers")
                }><Card.Title>Retailers</Card.Title> 
                
                <Card.Img
                variant="top"
                src="https://cdn-icons-png.flaticon.com/512/169/169837.png"
              />
            </Card.Body>
          </Card>
        </CardGroup>
      ) : (
        <>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => setShowMain(true)}>
              List
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{subTitle}</Breadcrumb.Item>
            <Breadcrumb.Item active>Add</Breadcrumb.Item>
          </Breadcrumb>
          <form onSubmit={handlerSubmit} className="m-20">
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangeAddress}
              placeholder="Ethereum Address"
              required
            />
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangeName}
              placeholder="Raw Material Supplier Name"
              required
            />
            <input
              className="form-control-sm m-r-15"
              type="text"
              onChange={handlerChangePlace}
              placeholder="Based In"
              required
            />
            <button
              className="btn btn-outline-success btn-sm"
              onSubmit={handlerSubmit}
            >
              Add
            </button>
          </form>
          <Table responsive="sm">
            <thead>
              <tr>
                <th>S. No</th>
                <th>Name</th>
                <th>Place</th>
                <th>Ethereum Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map(function (key) {
                return (
                  <tr key={key}>
                    <td>{tableData[key]?.id}</td>
                    <td>{tableData[key]?.name}</td>
                    <td>{tableData[key]?.place}</td>
                    <td>{tableData[key]?.addr}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}

export default Register;
