import { useState } from "react";
import {
  ChainlinkPlugin,
  MainnetPriceFeeds,
} from "@chainsafe/web3-plugin-chainlink";
import { Web3 } from "web3";
import "./App.css";

function App() {
  // const [price, setPrice] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [dollarAmount, setDollarAmount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize rpc/provider
  const web3 = new Web3(window.ethereum);

  // register plugin
  web3.registerPlugin(new ChainlinkPlugin());

  // async function getEthPrice() {
  //   const results = await web3.chainlink.getPrice(MainnetPriceFeeds.EthUsd);
  //   const resultPrice = results.answer.toString().substring(0, 4);
  //   setPrice(resultPrice);
  //   console.log(resultPrice);
  // }

  // dollar amount

  async function getEthPrice() {
    setLoading(true);
    try {
      const results = await web3.chainlink.getPrice(MainnetPriceFeeds.EthUsd);
      const ethPrice = results.answer.toString().substring(0, 4); // Adjust for decimal places
      setPrice(ethPrice);
      convertToEth(ethPrice);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
    setLoading(false);
  }

  function convertToEth(ethPrice) {
    if (dollarAmount && ethPrice) {
      const convertedAmount = (dollarAmount / ethPrice).toFixed(4);
      setEthAmount(convertedAmount);
    }
  }

  const handleDollarAmountChange = (e) => {
    setDollarAmount(e.target.value);
    if (price) {
      convertToEth(price);
    }
  };

  return (
    // <main className=" flex flex-col gap-6">
    //   <h4>{price}</h4>
    //   <button className="cursor-pointer" onClick={getEthPrice}>
    //     Get ETh Price
    //   </button>
    // </main>
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex items-center justify-center">
      <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg space-y-8">
        <h1 className="text-4xl font-bold text-center">Crypto Converter</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="dollarAmount" className="text-lg">
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
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all"
            onClick={getEthPrice}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mx-auto"></div>
            ) : (
              "Get ETH Equivalent"
            )}
          </button>
          {ethAmount && (
            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold">ETH Equivalent</p>
              <p className="text-4xl font-bold">{ethAmount} ETH</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
