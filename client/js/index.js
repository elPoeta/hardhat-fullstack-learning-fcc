import { ethers } from "./ethers-5.8.0.esm.min.js";
import { abi, contractAddress } from "./utils/fundMe.js";

const root = document.getElementById("root");
console.log(ethers);

const mainTemplate = () => `
  <section>
    <h2>ETH: <span id="ethBalance">0</span></h2>
    <div style="margin: 10px 0;">
      <label for="amount">Amount</label>
      <input id="amount" name="amount" type="number" value="0.1"  step="any" />
      <button id="fundBtn">Fund</button>
    </div>
    <div style="margin: 10px 0;">
      <button id="withdrawBtn">Withdraw</button>
    </div>
    <div style="margin: 10px 0;">
      <button id="balanceBtn">Balance</button>
    </div>
  </section>
`;

const txMineListener = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
};

const fund = async (ethAmount) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider);
  const signer = provider.getSigner();
  console.log(signer);
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
    await txMineListener(transactionResponse, provider);
    console.log("Done!");
  } catch (error) {
    console.log(error);
  }
};

const fundHandler = () => {
  const ethAmount = document.querySelector("#amount").value.toString();
  fund(ethAmount);
};

const withdrawHandler = async () => {};

const balanceHandler = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
    document.querySelector("#ethBalance").innerHTML =
      ethers.utils.formatEther(balance);
  } catch (error) {
    console.log(error);
  }
};

const connectHandler = async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    root.innerHTML = mainTemplate();
    document.querySelector("#fundBtn").addEventListener("click", fundHandler);
    document
      .querySelector("#withdrawBtn")
      .addEventListener("click", withdrawHandler);
    document
      .querySelector("#balanceBtn")
      .addEventListener("click", balanceHandler);
  } catch (error) {
    console.log(error);
  }
};

const app = () => {
  if (typeof window.ethereum !== "undefined") {
    root.innerHTML = `<button id="connectBtn">connect</button>`;
    document
      .querySelector("#connectBtn")
      .addEventListener("click", connectHandler);
  } else {
    root.innerHTML = `<h2 style="color:red;">Please install Metamask!</h2>`;
  }
};

app();
