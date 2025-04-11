// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    address public admin;
    bool public votingActive;

    struct Proposal {
        string name;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => bool) public hasVoted;

    event ProposalCreated(string name);
    event Voted(address voter, uint proposalIndex);
    event VotingEnded();

    constructor(string[] memory proposalNames) {
        admin = msg.sender;
        votingActive = true;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal(proposalNames[i], 0));
            emit ProposalCreated(proposalNames[i]);
        }
    }

    function vote(uint proposalIndex) external {
        require(votingActive, "Voting is closed");
        require(!hasVoted[msg.sender], "You already voted");
        require(proposalIndex < proposals.length, "Invalid proposal");

        proposals[proposalIndex].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, proposalIndex);
    }

    function endVoting() external {
        require(msg.sender == admin, "Only admin can end voting");
        votingActive = false;
        emit VotingEnded();
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }
}
