document.addEventListener('DOMContentLoaded', () => {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);

    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileChange);

    function handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    function handleDragLeave(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');
    }

    function handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        displayFileDetails(files);
    }

    function handleFileChange(event) {
        const files = event.target.files;
        displayFileDetails(files);
    }

    function displayFileDetails(files) {
        let fileNames = '';
        const userName = document.getElementById('uName').value;

        // Create a new instance of the blockchain
        const myBlockchain = new Blockchain();

        for (const file of files) {
            fileNames += `${file.name}, `;
            calculateFileHash(file)
                .then(hash => {
                    console.log(`${file.name} - Hash: ${hash}`);

                    // Create a new block in the blockchain for each file
                    const newBlock = myBlockchain.createNewBlock({
                        fileName: file.name,
                        hash: hash,
                        uploadedBy: userName,
                    });

                    x01(hash, userName, newBlock.hash);

                    // Store hash and name in local storage
                    storeHashAndName(hash, userName);
                })
                .catch(error => {
                    console.error(`Error calculating hash for ${file.name}: ${error.message}`);
                });
        }

        fileList.textContent = fileNames.slice(0, -2); // Remove the trailing comma and space
    }

    function calculateFileHash(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function (event) {
                const buffer = event.target.result;

                // Use the Web Crypto API to calculate the SHA-256 hash
                crypto.subtle.digest('SHA-256', buffer)
                    .then(hashArrayBuffer => {
                        const hashArray = Array.from(new Uint8Array(hashArrayBuffer));
                        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
                        resolve(hashHex);
                    })
                    .catch(reject);
            };

            reader.onerror = function (error) {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    }

    function x01(hash, name, latestHash) {
        const hashID = document.getElementById('hashID');
        hashID.innerText = 'Hash : ' + hash;
        console.log(hash);
        console.log(name);
        console.log(`Latest Hash: ${latestHash}`);
    }

    // Function to store hash and name in local storage
    function storeHashAndName(hash, name) {
        const storedData = JSON.parse(localStorage.getItem('hashAndName')) || [];
        storedData.push({ hash, name });
        localStorage.setItem('hashAndName', JSON.stringify(storedData));
    }

    class Block {
        constructor(index, previousHash, timestamp, data, hash) {
            this.index = index;
            this.previousHash = previousHash;
            this.timestamp = timestamp;
            this.data = data;
            this.hash = hash;
        }
    }

    class Blockchain {
        constructor() {
            this.chain = [this.createGenesisBlock()];
        }

        createGenesisBlock() {
            return new Block(0, '0', new Date().toUTCString(), 'Genesis Block', this.calculateHash(0, '0', new Date().toUTCString(), 'Genesis Block'));
        }

        async calculateHash(index, previousHash, timestamp, data) {
            const encoder = new TextEncoder();
            const buffer = encoder.encode(index + previousHash + timestamp + data);

            // Use the Web Crypto API to calculate the SHA-256 hash
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

            return hashHex;
        }

        createNewBlock(data) {
            const previousBlock = this.chain[this.chain.length - 1];
            const newIndex = previousBlock.index + 1;
            const newTimestamp = new Date().toUTCString();
    
            // Use JSON.stringify to convert the data object to a string
            return this.calculateHash(newIndex, previousBlock.hash, newTimestamp, JSON.stringify(data))
                .then(newHash => {
                    const newBlock = new Block(newIndex, previousBlock.hash, newTimestamp, data, newHash);
                    this.chain.push(newBlock);
                    return newBlock;
                })
                .catch(error => {
                    console.error(`Error calculating hash: ${error.message}`);
                });
        }
    }
});

function uploadFiles() {
    // Implement file upload logic here, e.g., send files to the server
    const message = document.getElementById('message');
    message.innerText = 'File Uploaded';
}
