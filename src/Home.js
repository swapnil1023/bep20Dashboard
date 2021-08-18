import React, { useState, useEffect } from "react";

import getWeb3 from "./getWeb3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./config";

import {
  Button,
  Container,
  makeStyles,
  Menu,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";

const options = [
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png",
    name: "BNB",
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    name: "ETH",
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  },
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    name: "MATIC",
    address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
  },
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png",
    name: "BUSD pegged",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  },

  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/8757.png",
    name: "SAFEMOON",
    address: "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
  },
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png",
    name: "CAKE",
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  },
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    name: "BTC pegged",
    address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
  },
  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    name: "ADA pegged",
    address: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
  },

  {
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    name: "LINK pegged",
    address: "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
  },
];

const ITEM_HEIGHT = 80;

const useStyles = makeStyles(() => ({
  button: {
    textTransform: "none",
    fontFamily: "Montserrat",
    color: "white",
    backgroundColor: "rgb(90, 98, 104)",
    padding: "8px 20px",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0px",
    "&:hover": {
      backgroundColor: "rgb(50, 50, 50)",
    },
  },
}));

const CustomCard = ({ id, img, heading, text }) => {
  return (
    <div
      style={{
        display: "flex",
        margin: "10px 0px",
        justifyContent: "flex-start",
        width: "300px",
      }}
    >
      <div style={{ marginRight: "15px" }}>
        <img
          src={img}
          alt={`card_${id}`}
          style={{ width: "60px", filter: "invert(1)" }}
        ></img>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          textAlign: "left",
          margin: "auto",
        }}
      >
        <div>{heading}</div>
        <div>{text}</div>
      </div>
    </div>
  );
};

let acc;

const Home = () => {
  const classes = useStyles();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  const [currency, setCurrency] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rewardInfo, setRewardInfo] = useState(null);
  const [totalRewardsCount, setTotalRewardsCount] = useState(null);

  const [status, setStatus] = useState(0);
  const [flag, setFlag] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const connectWallet = async () => {
    setStatus(0);
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      //   web3.eth.net.getId().then((res) => {
      //     if (res === 3) setBadge(false);
      //     else setBadge(true);
      //   });
      // Use web3 to get the user's accounts.
      let accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      //const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      var abi = CONTRACT_ABI;
      var contractAddress = CONTRACT_ADDRESS;
      const tokenContract = new web3.eth.Contract(abi, contractAddress);

      //   const escrowInstance = new web3.eth.Contract(
      //     ESCROW_CONTRACT_ABI,
      //     ESCROW_CONTRACT_ADDRESS
      //   );

      //   updateContracts([tokenContract, escrowInstance]);

      // new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      acc = accounts[0];

      setWeb3(web3);
      setAccounts(accounts);
      setContract(tokenContract);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
      setStatus(-1);
    }
  };

  const disconnect = () => {
    setStatus(0);

    sessionStorage.removeItem("connected");
    // updateUser(null);
    // updateContracts(null);

    setStatus(-1);

    handleClose();
  };

  useEffect(() => {
    disconnect();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("accountsChanges", accounts);
        if (accounts.length === 0 || acc !== accounts[0]) {
          if (acc) disconnect();
          acc = null;
        }
      });
    }
  }, []);

  useEffect(() => {
    if (web3 && accounts && accounts.length > 0) {
      if (accounts && accounts.length > 0) {
        console.log(accounts);
      }
      setStatus(1);
    }
  }, [accounts]);

  useEffect(() => {
    if (contract) {
      console.log(contract);

      getCustomToken();
      getTotalRewardsDistr();
    }
  }, [contract]);

  const getCustomToken = () => {
    contract.methods
      .seeUserCustomToken(accounts[0])
      .call()
      .then((res) => {
        console.log(res);

        const match = options.find((el) => el.address === res);
        setCurrency(match);

        getBalance();
        getRewardsInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeCustomToken = (selec) => {
    contract.methods
      .changeUserCustomToken(accounts[0], selec.address)
      .send({ from: accounts[0] })
      .then((res) => {
        console.log(res);

        // const match = options.find((el) => el.address === res);
        setCurrency(selec);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetCustomToken = (selec) => {
    contract.methods
      .resetUserCustomToken(accounts[0])
      .send({ from: accounts[0] })
      .then((res) => {
        console.log(res);

        // const match = options.find((el) => el.address === res);
        setCurrency(selec);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const claimReward = () => {
    contract.methods
      .claim()
      .send({ from: accounts[0] })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBalance = () => {
    contract.methods
      .balanceOf(accounts[0])
      .call()
      .then((res) => {
        setBalance(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRewardsInfo = () => {
    contract.methods
      .getAccountRewardsInfo(accounts[0])
      .call()
      .then((res) => {
        console.log(res);
        setRewardInfo(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalRewardsDistr = () => {
    contract.methods
      .getTotalRewardsDistributed()
      .call()
      .then((res) => {
        console.log(res);
        setTotalRewardsCount(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (currency) setFlag(1);
  }, [currency]);

  if (balance && balance / Math.pow(10, 18) < 25000)
    return (
      <div>
        <Container>
          <div
            style={{
              margin: "40px 0px",
            }}
          >
            <Button
              className={classes.button}
              style={{ minWidth: "100px" }}
              onClick={() => {
                if (status === -1) connectWallet();
              }}
            >
              {status === -1 ? (
                "Connect Wallet"
              ) : status === 0 ? (
                <CircularProgress
                  style={{ color: "white", width: "25px", height: "25px" }}
                />
              ) : (
                "Connected"
              )}
            </Button>
          </div>
          <h1>COCKTAIL LOUNGE</h1>
          <div>
            <p>You should hold atleast 25,000 COCKTAIL to receive rewards</p>
          </div>
        </Container>
      </div>
    );

  return (
    <div>
      <Container>
        <div
          style={{
            margin: "40px 0px",
          }}
        >
          <Button
            className={classes.button}
            style={{ minWidth: "100px" }}
            onClick={() => {
              if (status === -1) connectWallet();
            }}
          >
            {status === -1 ? (
              "Connect Wallet"
            ) : status === 0 ? (
              <CircularProgress
                style={{ color: "white", width: "25px", height: "25px" }}
              />
            ) : (
              "Connected"
            )}
          </Button>
        </div>
        <h1>COCKTAIL LOUNGE</h1>

        <div>Current Reward Currency:</div>
        <div style={{ margin: "20px 0px" }}>
          <Button
            className={classes.button}
            style={{ marginRight: "10px" }}
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            {flag === 0 && status === 1 ? (
              <CircularProgress
                style={{ width: "25px", height: "25px", color: "white" }}
              />
            ) : currency ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  style={{ width: "30px", marginRight: "15px" }}
                  src={currency.image}
                  alt="selection"
                />
                {currency.name}
              </div>
            ) : (
              "Switch Reward Currency"
            )}
          </Button>
          <Button
            className={classes.button}
            style={{ marginLeft: "10px" }}
            onClick={() => {
              claimReward();
            }}
          >
            Claim
          </Button>
        </div>
        <div>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
          >
            {options
              .sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
              })
              .map((curr, index) => (
                <MenuItem
                  key={"menu-" + index}
                  selected={curr === "Pyxis"}
                  style={{ fontFamily: "Montserrat" }}
                  onClick={() => {
                    setFlag(0);

                    if (
                      curr.address ===
                      "0x0000000000000000000000000000000000000000"
                    )
                      resetCustomToken(curr);
                    else changeCustomToken(curr);

                    handleClose();
                  }}
                >
                  <div style={{ alignItems: "center", display: "flex" }}>
                    <img
                      style={{ width: "30px", marginRight: "15px" }}
                      src={curr.image}
                      alt={`curr_${index}`}
                    ></img>
                    {curr.name}
                  </div>
                </MenuItem>
              ))}
          </Menu>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CustomCard
            id="1"
            heading="Total Rewards Distributed"
            text={`${
              totalRewardsCount
                ? (totalRewardsCount / Math.pow(10, 18)).toFixed(4)
                : 0
            } - Cocktail`}
            img="https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0006_Wallet.png"
          />
          <CustomCard
            id="1"
            heading="Your cocktail holdings"
            text={`${
              balance ? (balance / Math.pow(10, 18)).toFixed(4) : 0
            } - Cocktail`}
            img="https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0006_Wallet.png"
          />
          <CustomCard
            id="1"
            heading="Total rewards"
            text={`${
              rewardInfo ? (rewardInfo[4] / Math.pow(10, 18)).toFixed(4) : 0
            }`}
            img="https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0006_Wallet.png"
          />
          <CustomCard
            id="1"
            heading="Withdrawable rewards"
            text={`${
              rewardInfo ? (rewardInfo[3] / Math.pow(10, 18)).toFixed(4) : 0
            }`}
            img="https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0006_Wallet.png"
          />
          <CustomCard
            id="1"
            heading="Last payout received"
            text={`${
              rewardInfo ? (rewardInfo[6] / Math.pow(10, 18)).toFixed(4) : 0
            }`}
            img="https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0006_Wallet.png"
          />
          <CustomCard
            id="1"
            heading="Your payout time"
            text={`${rewardInfo ? rewardInfo[5] : "-"}`}
            img="https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0006_Wallet.png"
          />
        </div>
      </Container>
    </div>
  );
};

export default Home;
