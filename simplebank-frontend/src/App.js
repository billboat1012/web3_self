import { useEffect, useState } from "react";
import { ethers } from "ethers";
import bankABI from "./contract/SimpleBankABI.json";

const contractAddress = "0x4284955DA6BB1188bc6179BCc8912F28772B1387";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask.");
          return;
        }

        const _provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const _signer = await _provider.getSigner();
        const /* _account is a variable that stores the Ethereum wallet address of the connected
        signer. It is obtained by calling the getAddress() method on the signer object. This
        address is used to identify the user's account within the Ethereum network and is
        displayed in the dApp interface to show which wallet is currently connected. */
        /* _account is a variable that stores the Ethereum wallet address of the connected
        signer. It is obtained by calling the getAddress() method on the signer object. This
        address is used to identify the user's account within the Ethereum network and is
        displayed in the dApp interface to show which wallet is currently connected. */
        _account = await _signer.getAddress();
        const _contract = new ethers.Contract(contractAddress, bankABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        setAccount(_account);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Failed to connect wallet: " + (error?.message || error));
      }
    };

    init();
  }, []);

  const fetchBalance = async () => {
    try {
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error("Fetch balance error:", error);
      alert("Failed to fetch balance: " + (error?.message || error));
    }
  };

  const deposit = async () => {
    try {
      if (!depositAmount) return alert("Enter a deposit amount.");
      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount),
      });
      await tx.wait();
      setDepositAmount("");
      fetchBalance();
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Deposit failed: " + (error?.message || error));
    }
  };

  const withdraw = async () => {
    try {
      if (!withdrawAmount) return alert("Enter a withdrawal amount.");
      const tx = await contract.withdraw(ethers.parseEther(withdrawAmount));
      await tx.wait();
      setWithdrawAmount("");
      fetchBalance();
    } catch (error) {
      console.error("Withdraw error:", error);
      alert("Withdraw failed: " + (error?.message || error));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>🪙 SimpleBank dApp</h1>

      {contract ? (
        <>
          <p><strong>Connected wallet:</strong> {account}</p>

          <button onClick={fetchBalance}>Check Balance</button>
          <h2>Your Balance: {balance} ETH</h2>

          <div style={{ marginTop: 30 }}>
            <h3>💰 Deposit</h3>
            <input
              type="number"
              placeholder="Amount in ETH"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={deposit}>Deposit</button>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3>🏧 Withdraw</h3>
            <input
              type="number"
              placeholder="Amount in ETH"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button onClick={withdraw}>Withdraw</button>
          </div>
        </>
      ) : (
        <p>🔄 Connecting to SimpleBank contract...</p>
      )}
    </div>
  );
}

export default App;
