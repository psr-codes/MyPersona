// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title IIssuerRegistry
 * @dev This is an interface. It just tells this contract *how* to
 * talk to the `IssuerRegistry` contract. It defines the one
 * function we need to call: `isTrustedIssuer`.
 */
interface IIssuerRegistry {
    function isTrustedIssuer(address _issuerAddress) external view returns (bool);
}

/**
 * @title RevocationRegistry
 * @dev This contract maintains a list of revoked credentials.
 * Only a trusted issuer (from the `IssuerRegistry` contract) can revoke
 * a credential.
 * Anyone (e.g., a Verifier app) can check if a credential is revoked.
 */
contract RevocationRegistry is Ownable, Pausable {

    // This is the address of the `IssuerRegistry` contract you deployed first.
    // This linkage is the core of the security model.
    IIssuerRegistry public issuerRegistry;

    // The list of revoked credentials.
    // The key is a unique ID for the credential (e.g., a hash or nonce).
    // `public` creates the `isRevoked(uint256)` getter function.
    mapping(uint256 => bool) public isRevoked;

    // Events for off-chain monitoring.
    event CredentialRevoked(address indexed issuerAddress, uint256 indexed credentialNonce);
    event CredentialUnRevoked(address indexed issuerAddress, uint256 indexed credentialNonce);
    event IssuerRegistryAddressUpdated(address indexed newRegistryAddress);

    /**
     * @dev Custom error for better debugging.
     */
    error CallerNotTrustedIssuer();

    /**
     * @dev This modifier is the most important part.
     * It checks if the address calling the function is listed as
     * "trusted" in the `IssuerRegistry` contract.
     */
    modifier onlyTrustedIssuer() {
        if (!issuerRegistry.isTrustedIssuer(msg.sender)) {
            revert CallerNotTrustedIssuer();
        }
        _;
    }

    /**
     * @dev Constructor sets the deployer as owner and, crucially,
     * links this contract to the `IssuerRegistry`.
     * @param _issuerRegistryAddress The address of your deployed `IssuerRegistry` contract.
     */
    constructor(address _issuerRegistryAddress, address initialOwner) Ownable(initialOwner) {
        require(_issuerRegistryAddress != address(0), "RevocationRegistry: Registry address cannot be zero");
        issuerRegistry = IIssuerRegistry(_issuerRegistryAddress);
        emit IssuerRegistryAddressUpdated(_issuerRegistryAddress);
    }

    /**
     * @dev Revokes a credential, marking it as invalid.
     * Can only be called by a trusted issuer.
     * The contract must not be paused.
     * @param _credentialNonce A unique identifier for the credential.
     */
    function revokeCredential(uint256 _credentialNonce)
        external
        onlyTrustedIssuer
        whenNotPaused
    {
        require(!isRevoked[_credentialNonce], "RevocationRegistry: Credential already revoked");

        isRevoked[_credentialNonce] = true;
        emit CredentialRevoked(msg.sender, _credentialNonce);
    }

    /**
     * @dev Re-instates a credential (in case of revocation error).
     * Can only be called by a trusted issuer.
     * The contract must not be paused.
     * @param _credentialNonce A unique identifier for the credential.
     */
    function unRevokeCredential(uint256 _credentialNonce)
        external
        onlyTrustedIssuer
        whenNotPaused
    {
        require(isRevoked[_credentialNonce], "RevocationRegistry: Credential is not currently revoked");

        isRevoked[_credentialNonce] = false;
        emit CredentialUnRevoked(msg.sender, _credentialNonce);
    }

    /**
     * @dev Allows the owner to update the address of the `IssuerRegistry`
     * This is an important admin function for long-term maintenance.
     * @param _newRegistryAddress The address of the new registry contract.
     */
    function setIssuerRegistryAddress(address _newRegistryAddress)
        external
        onlyOwner
    {
        require(_newRegistryAddress != address(0), "RevocationRegistry: New registry address cannot be zero");
        issuerRegistry = IIssuerRegistry(_newRegistryAddress);
        emit IssuerRegistryAddressUpdated(_newRegistryAddress);
    }

    /**
     * @dev Pauses the contract.
     * `revokeCredential` and `unRevokeCredential` will be disabled.
     * The `isRevoked` getter will still work (critical for verifiers).
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