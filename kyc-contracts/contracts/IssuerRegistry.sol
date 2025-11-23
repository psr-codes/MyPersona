// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// We import Ownable for secure, simple ownership management.
// This gives you an `owner()` and an `onlyOwner` modifier.
import "@openzeppelin/contracts/access/Ownable.sol";
// We import Pausable for emergency-stop functionality.
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title IssuerRegistry
 * @dev This contract manages a list of trusted issuers (e.g., banks, governments).
 * Only the owner (you, the admin) can add or remove issuers.
 * Anyone (e.g., a Verifier app) can check if an issuer is trusted.
 * It is Pausable, so you can stop new issuers from being added/removed in an emergency.
 */
contract IssuerRegistry is Ownable, Pausable {

    // This is the core of the contract.
    // A mapping from an issuer's address to a boolean (true = trusted).
    // It's public, so Solidity automatically creates a getter function:
    // `isTrustedIssuer(address)` which anyone can call.
    mapping(address => bool) public isTrustedIssuer;

    // Events make it easy for off-chain applications to listen for changes.
    event IssuerAdded(address indexed issuerAddress);
    event IssuerRemoved(address indexed issuerAddress);

    /**
     * @dev Sets the initial owner of the contract to the deployer's address.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Adds a new trusted issuer to the registry.
     * Can only be called by the owner.
     * The contract must not be paused.
     * @param _issuerAddress The address of the new issuer to add.
     */
    function addIssuer(address _issuerAddress) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        require(_issuerAddress != address(0), "IssuerRegistry: Cannot add the zero address");
        require(!isTrustedIssuer[_issuerAddress], "IssuerRegistry: Issuer is already trusted");

        isTrustedIssuer[_issuerAddress] = true;
        emit IssuerAdded(_issuerAddress);
    }

    /**
     * @dev Removes a trusted issuer from the registry.
     * Can only be called by the owner.
     * The contract must not be paused.
     * @param _issuerAddress The address of the issuer to remove.
     */
    function removeIssuer(address _issuerAddress) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        require(isTrustedIssuer[_issuerAddress], "IssuerRegistry: Issuer is not currently trusted");

        isTrustedIssuer[_issuerAddress] = false;
        emit IssuerRemoved(_issuerAddress);
    }

    /**
     * @dev Pauses the contract.
     * `addIssuer` and `removeIssuer` will be disabled.
     * The `isTrustedIssuer` getter will still work, which is crucial.
     * Can only be called by the owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract.
     * Can only be called by the owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}