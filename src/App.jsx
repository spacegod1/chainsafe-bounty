import { useState, useEffect } from "react";
import {
  ChainlinkPlugin,
  MainnetPriceFeeds,
} from "@chainsafe/web3-plugin-chainlink";
import { Web3 } from "web3";
import loader from "./assets/spinner.svg";
import logo from "./assets/swap-color.png";
import love from "./assets/love.png";
import { FaGithub } from "react-icons/fa";
import "./App.css";

function App() {
  const [dollarAmount, setDollarAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("EthUsd");

  // Initialize rpc/provider
  const web3 = new Web3(window.ethereum);

  // register plugin
  web3.registerPlugin(new ChainlinkPlugin());

  const cryptoOptions = {
    EthUsd: MainnetPriceFeeds.EthUsd,
    BtcUsd: MainnetPriceFeeds.BtcUsd,
    LinkUsd: MainnetPriceFeeds.LinkUsd,
    SolUsd: MainnetPriceFeeds.SolUsd,
    // Add other cryptocurrencies here if supported by Chainlink's price feeds
  };
  // dollar amount

  async function getEthPrice() {
    setLoading(true);
    try {
      const results = await web3.chainlink.getPrice(
        cryptoOptions[selectedCrypto]
      );

      let cryptoPrice = results.answer.toString().substring(0, 5); // Adjust for decimal places
      if (selectedCrypto === "EthUsd") {
        let actualEth = cryptoPrice / 10;
        convertToEth(actualEth);
      } else if (selectedCrypto === "BtcUsd") {
        convertToBtc(cryptoPrice);
      } else if (selectedCrypto === "LinkUsd") {
        let actualLink = cryptoPrice / 1000;
        convertToLinkandSol(actualLink);
      } else if (selectedCrypto === "SolUsd") {
        let actualSol = cryptoPrice / 100;
        convertToLinkandSol(actualSol);
      }
      // else if (selectedCrypto) {

      // }
    } catch (error) {
      console.error("Error fetching price:", error);
    }
    setLoading(false);
  }

  // console.log(selectedCrypto);

  function convertToEth(ethPrice) {
    if (dollarAmount && ethPrice && selectedCrypto === "EthUsd") {
      const convertedAmount = (dollarAmount / ethPrice).toFixed(4);
      setCryptoAmount(convertedAmount);
    }
  }

  function convertToBtc(btcPrice) {
    if (dollarAmount && btcPrice && selectedCrypto === "BtcUsd") {
      const convertedAmount = (dollarAmount / btcPrice).toFixed(7);
      setCryptoAmount(convertedAmount);
    }
  }

  function convertToLinkandSol(price) {
    if (
      dollarAmount &&
      price &&
      (selectedCrypto === "LinkUsd" || selectedCrypto === "SolUsd")
    ) {
      const convertedAmount = (dollarAmount / price).toFixed(2);
      setCryptoAmount(convertedAmount);
    }
  }

  useEffect(() => {
    setDollarAmount(""); //Listening for changes on selectedCrypto
    setCryptoAmount("");
  }, [selectedCrypto]);

  const handleDollarAmountChange = (e) => {
    setDollarAmount(e.target.value);
  };

  const handleCryptoChange = (e) => {
    setSelectedCrypto(e.target.value);
    setDollarAmount("");
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-900 to-gray-900 text-white flex flex-col items-center justify-center">
      <div className="p-6 mx-4 md:mx-auto bg-gray-800 rounded-lg shadow-lg space-y-10">
        <h1 className="text-xl md:text-4xl font font-normal text-center">
          Crypto C{/* <span> */}
          <img src={logo} alt="logo" className="h-7 w-7 inline" />
          {/* </span> */}
          nverter
        </h1>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col gap-[0.6rem]">
            <label htmlFor="cryptoSelect" className="text-sm titles">
              Select Cryptocurrency
            </label>
            <select
              id="cryptoSelect"
              value={selectedCrypto}
              onChange={handleCryptoChange}
              className="p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EthUsd">Ethereum (ETH)</option>
              <option value="BtcUsd">Bitcoin (BTC)</option>
              <option value="LinkUsd">Chainlink (LINK)</option>
              <option value="SolUsd">Solana (SOL)</option>
            </select>
            <label htmlFor="dollarAmount" className="text-sm titles">
              Enter Dollar Amount ($)
            </label>
            <input
              id="dollarAmount"
              type="number"
              value={dollarAmount}
              onChange={handleDollarAmountChange}
              className="p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount in USD"
            />
          </div>
          <button
            className="w-full bg-blue-600 tracking-widest hover:bg-blue-500 text-white font text-sm md:text-[18px] font-normal py-2 px-4 rounded-full transition-all"
            onClick={getEthPrice}
            disabled={loading}
          >
            {loading ? (
              <img
                src={loader}
                alt="loading gif"
                className="h-[2.1rem] w-[2.1rem] inline"
              />
            ) : (
              "CONVERT"
            )}
          </button>
          {cryptoAmount && (
            <div className="text-center space-y-2">
              <p className="text-4xl">
                {cryptoAmount} {selectedCrypto.replace("Usd", "").toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[6.5rem] text-[#8195a6]">
        <small className="tracking-wide">
          Made with <img className="inline h-5 w-5" src={love} alt="love" /> by{" "}
          $pacegod
          <a
            className="text-[#E0BB20]"
            target="_blank"
            href="https://github.com/spacegod1/chainsafe-bounty"
          >
            <FaGithub className="inline ml-4" size={20} />
          </a>
        </small>
      </div>
    </div>
  );
}

export default App;
