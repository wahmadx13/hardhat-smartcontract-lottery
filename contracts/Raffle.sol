// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

error Raffle__NotEnoughETHEntered();

contract Raffle {
  /* State Variables */
  uint256 private immutable i_enterenceFee;
  address payable[] private s_players;

  constructor(uint256 entrenceFee) {
    i_enterenceFee = entrenceFee;
  }

  function enterRaffle() public payable {
    if (msg.value < i_enterenceFee) {
      revert Raffle__NotEnoughETHEntered();
    }
  }

  function getEnterenceFee() public view returns (uint256) {
    return i_enterenceFee;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }
}
