import { ethers } from "./ethers-5.8.0.esm.min.js";

const root = document.getElementById("root");
console.log(ethers);

const connectHandler = async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
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
