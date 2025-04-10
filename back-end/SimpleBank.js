const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleBank", function () {
  let SimpleBank, bank, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    SimpleBank = await ethers.getContractFactory("SimpleBank");
    bank = await SimpleBank.deploy();
    await bank.deployed();
  });

  it("Should allow a user to deposit ETH", async function () {
    const depositAmount = ethers.utils.parseEther("1.0");
    await bank.connect(addr1).deposit({ value: depositAmount });

    const balance = await bank.balances(addr1.address);
    expect(balance).to.equal(depositAmount);
  });

  it("Should allow a user to withdraw ETH", async function () {
    const depositAmount = ethers.utils.parseEther("1.0");
    const withdrawAmount = ethers.utils.parseEther("0.5");

    await bank.connect(addr1).deposit({ value: depositAmount });
    await bank.connect(addr1).withdraw(withdrawAmount);

    const finalBalance = await bank.balances(addr1.address);
    expect(finalBalance).to.equal(depositAmount.sub(withdrawAmount));
  });

  it("Should fail if user withdraws more than they deposited", async function () {
    const depositAmount = ethers.utils.parseEther("0.3");
    const withdrawAmount = ethers.utils.parseEther("0.5");

    await bank.connect(addr1).deposit({ value: depositAmount });

    await expect(
      bank.connect(addr1).withdraw(withdrawAmount)
    ).to.be.revertedWith("Insufficient balance");
  });

  it("Should return user's balance using getBalance", async function () {
    const depositAmount = ethers.utils.parseEther("0.2");
    await bank.connect(addr1).deposit({ value: depositAmount });

    const balance = await bank.connect(addr1).getBalance();
    expect(balance).to.equal(depositAmount);
  });
});
