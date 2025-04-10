let web3;
let contract;
let accounts;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);

    const message = await contract.methods.message().call();
    document.getElementById("message").innerText = `Current message: ${message}`;
  } else {
    alert("Please install MetaMask!");
  }
});

async function updateMessage() {
  const newMsg = document.getElementById("newMessage").value;
  if (!newMsg) return alert("Enter a message!");

  try {
    await contract.methods.setMessage(newMsg).send({ from: accounts[0] });

    const updatedMsg = await contract.methods.message().call();
    document.getElementById("message").innerText = `Current message: ${updatedMsg}`;
  } catch (err) {
    console.error("Transaction failed:", err);
  }
}
