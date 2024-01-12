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

    async function displayFileDetails(files) {
        let fileNames = '';
        for (const file of files) {
            fileNames += `${file.name}, `;
        }
        fileList.textContent = fileNames.slice(0, -2); // Remove the trailing comma and space

        // Calculate and check the hash for each file
        await checkFileHashes(files);
    }

    async function checkFileHashes(files) {
        const message = document.getElementById('message');
    
        // Load stored data from local storage
        const storedData = JSON.parse(localStorage.getItem('hashAndName')) || [];
    
        // Example verification logic: Check if the hash of each file is present in the stored data
        for (const file of files) {
            try {
                const fileHash = await calculateFileHash(file);
    
                // Find the matching entry in the stored data
                const storedEntry = storedData.find(entry => entry.hash === fileHash);
                const fileName = document.getElementById('fileName')
                const issuerName = document.getElementById('issuerName')
                const fileHashx01 = document.getElementById('fileHashx01')
                const reload = document.getElementById('reload')
                const issuedby = document.getElementById('issuedby')
                if (storedEntry) {
                    fileHashx01.style.display = 'block';
                    fileHashx01.innerText = `Hash : ${fileHash}`
                    fileName.innerText = `File Name : ${file.name}`
                    message.style.color ='green'
                    issuerName.style.display = 'block';
                    issuerName.innerText = `Issued to : ${storedEntry.name}`;
                    message.innerText = `Verification Successful !`;
                    issuedby.style.display= 'block';
                    reload.style.display='block';

                    
                } else {
                    fileName.innerText = `File Name : ${file.name}`
                    message.style.color ='red'
                    issuerName.style.display = 'none';
                    message.innerText = `Verification Failed, Hash not present in Blockchain.`;
                    reload.style.display='block'
                    return;  // Stop further checks if any file hash is not present in the stored data
                }
            } catch (error) {
                console.error(`Error calculating hash for ${file.name}:`, error);
                message.innerText = 'Error calculating hash.';
            }
        }
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

    function reload() {
        // Add any specific logic for handling file upload if needed
        // This function is not modified in this example
        location.reload();
    }
});
