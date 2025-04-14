import { useEffect, useState } from "react";
import { ethers } from "ethers";
import votingABI from "./contract/VotingABI.json";

const contractAddress = "0x985e3DCf709F87aA700251C9A7ECFEe925650fC3";

function App() {
  const [admin, setAdmin] = useState("");
  const [votingActive, setVotingActive] = useState(true);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // connect wallet + load contract
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _account = await signer.getAddress();
      const _contract = new ethers.Contract(contractAddress, votingABI, signer);

      setAccount(_account);
      setContract(_contract);

      const _admin = await _contract.admin();
      const _votingActive = await _contract.votingActive();

      setAdmin(_admin);
      setVotingActive(_votingActive);

    };
    init();
  }, []);

  // load proposals
  useEffect(() => {
    if (!contract) return;

    const fetchData = async () => {
      const props = await contract.getProposals();
      const _votingActive = await contract.votingActive();
      setProposals(props);
      setLoading(false);
      setVotingActive(_votingActive);
    };    

    // listen to votes
    const handleVote = (voter, index) => {
      console.log("📥 Vote cast:", voter, index.toString());
      fetchData();
      if (voter.toLowerCase() === account.toLowerCase()) {
        setHasVoted(true);
      }
    };

    contract.on("Voted", handleVote);
    fetchData();

    return () => {
      contract.off("Voted", handleVote);
    };
  }, [contract, account]);

  const vote = async (index) => {
    try {
      const tx = await contract.vote(index);
      await tx.wait();
    } catch (err) {
      console.error("Vote error:", err);
      alert(err?.reason || "Voting failed");
    }
  };

  const endVoting = async () => {
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      setVotingActive(false);
      alert("Voting has ended.");
    } catch (err) {
      console.error(err);
      alert(err?.reason || "Failed to end voting.");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <h1>🗳️ Voting DApp</h1>
      <p><strong>Wallet:</strong> {account}</p>

      {loading ? (
        <p>Loading proposals...</p>
      ) : (
        <div>
          {proposals.map((p, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h3>{p.name}</h3>
              <p>Votes: {p.voteCount.toString()}</p>
              <button disabled={hasVoted || !votingActive} onClick={() => vote(i)} 
                 className={`w-full py-2 px-4 rounded text-white ${
                  hasVoted || !votingActive
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {hasVoted ? "You already voted" : "Vote"}
              </button>
            </div>
          ))}
          {account.toLowerCase() === admin.toLowerCase() && votingActive && (
            <button
              onClick={endVoting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-4 rounded shadow w-full"
            >
              End Voting (Admin only)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
