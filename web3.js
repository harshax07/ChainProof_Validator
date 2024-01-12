const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); 


const contractCode = `
    pragma solidity ^0.8.0;

    contract SimpleBlockchain {
        uint public counter;
        function increment() public {
            counter++;
        }
    }
`;

const deployAndInteract = async () => {
  const accounts = await web3.eth.getAccounts();
  const deploy = new web3.eth.Contract(JSON.parse(contractCode));
  const deployedContract = await deploy.deploy({
    data: '0x' + contractCode.replace(/\r\n|\r|\n/g, ''),
  }).send({
    from: accounts[0],
    gas: '1000000',
  });

  console.log(`Contract deployed at address: ${deployedContract.options.address}`);
  await deployedContract.methods.increment().send({
    from: accounts[0],
  });
  const counterValue = await deployedContract.methods.counter().call();
  console.log(`Counter value: ${counterValue}`);
};

