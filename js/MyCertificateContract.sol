pragma solidity ^0.8.0;

contract MyCertificateContract {
    address public issuer;

    struct Certificate {
        string userName;
        bytes32 certificateHash;
        bool exists;
    }

    mapping(bytes32 => Certificate) public certificates;

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only issuer can call this function");
        _;
    }

    constructor() {
        issuer = msg.sender;
    }

    function storeCertificate(string memory userName, bytes32 certificateHash) public onlyIssuer {
        certificates[certificateHash] = Certificate({
            userName: userName,
            certificateHash: certificateHash,
            exists: true
        });
    }

    function getCertificateDetails(bytes32 certificateHash) public view returns (string memory, bytes32, bool) {
        return (certificates[certificateHash].userName, certificates[certificateHash].certificateHash, certificates[certificateHash].exists);
    }
}