// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, child, get, set, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
let MaincollectionName = null;
var val
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBaduGTnBvtDJ3vUiqEgh32bXrtT-xkEyc",
    authDomain: "connecting-database-7f942.firebaseapp.com",
    databaseURL: "https://connecting-database-7f942-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "connecting-database-7f942",
    storageBucket: "connecting-database-7f942.appspot.com",
    messagingSenderId: "53262625485",
    appId: "1:53262625485:web:e16dee72817b2183a09784",
    measurementId: "G-LLCV2JQPKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

// Reference to the root of your database
const rootRef = ref(database);

// Function to read data from the database
function readData(data) {
    return get(child(rootRef, `eid/${data}/`)).then((snapshot) => {
        if (snapshot.exists()) {
            // Return the value here
            return snapshot.val();
        } else {
            showToast("No data available.", false);
            console.log("No data available");
            return { status: false, msg: "No data available" }
        }
    }).catch((error) => {
        console.error(error);
        showToast("Server down.", false);
        return { status: false, msg: "Server down error 555" }
    });
}
// console.log(await readDataAll())
// Function to read data from the database
function readDataAll() {
    return get(child(rootRef, `eid/`)).then((snapshot) => {
        if (snapshot.exists()) {
            // Return the value here
            return snapshot.val();
        } else {
            showToast("No data available.", false);

            console.log("No data available");
            return { status: false, msg: "No data available" }
        }
    }).catch((error) => {
        console.error(error);
        return { status: false, msg: "Server down error 555" }
    });
}
// Function to write data to the database
function writeData(data) {
    push(child(rootRef, `eid/${MaincollectionName}/`), data)
        .then(() => {
            showToast("Added Record.", true);
            return "Data successfully written to the database";
        })
        .catch((error) => {
            showToast("Server down.", false);
            return "Error writing data to the database: " + error;
        });
}

function initialData(collectionName) {
    var data = {
        "Flat No": '0',
        "Name": "0",
        "Count": 0,
        "Status": 'waiting',
        "Parking": false
    };
    const jsonData = JSON.stringify(data);
    push(child(rootRef, `eid/${collectionName}/`), jsonData)
        .then(() => {
            showToast("Created Collection.", true);
            return "Data successfully written to the database";
        })
        .catch((error) => {
            showToast("Server down.", false);
            return "Error writing data to the database: " + error;
        });
}

// Function to update data in the database
function updateData(updates) {
    return update(child(rootRef, `eid/${MaincollectionName}/`), updates)
        .then(() => {
            showToast("Updated records.", true);
            return "Data successfully updated";
        })
        .catch((error) => {
            showToast("Server down.", false);

            throw "Error updating data: " + error;
        });
}
document.getElementById('addnewrec').addEventListener('click', () => {
    if (!MaincollectionName) {
        showToast("Please select a collection button before proceeding.", false);
        // alert("");
        return;
    }
    $("#exampleModal").modal('show');

})



document.getElementById('search').addEventListener('click', async () => {
    // Get the selected collection name
    if (!MaincollectionName) {
        showToast("Please select a collection button before proceeding.", false);
        return;
    }

    // Read data from the selected collection
    const val = await readData(MaincollectionName);
    const ul = document.querySelector('.list-group'); // Selecting the ul element

    // Check if data exists
    if (!val) {
        ul.innerHTML = '';
        document.getElementById('tGoats').innerText = 0;
        document.getElementById('tBGoats').innerText = 0;
        document.getElementById('tWGoats').innerText = 0;
        document.getElementById('tParking').innerText = 0; // Add a counter for Parking
        showToast("No data available for the selected collection.", false);
        return;
    }

    const sortedVal = Object.entries(val)
        .map(([key, value]) => ({ id: key, ...JSON.parse(value) }))
        .sort((a, b) => {
            // You can add sorting logic here if needed
        });

    // Clearing previous list items
    ul.innerHTML = '';
    let count = 1;
    let goatCount = 0;
    let goatCountBrought = 0;
    let goatCountWaiting = 0;
    let parkingCount = 0; // Parking counter

    for (let i in sortedVal) {
        let temp = sortedVal[i];
        console.log(temp)
        // Creating li element
        let li = document.createElement('li');
        li.setAttribute('id', temp['id']);
        li.classList.add('d-flex', 'flex-wrap', 'list-group-item', 'p-2', 'w-100');

        let div = document.createElement('div');
        div.textContent = `Sr. No.: ${count - 1}`;
        li.appendChild(div);

        // Creating and appending div elements with data
        ['Flat No', 'Name', 'Count', 'Status', 'Parking'].forEach(key => {
            let div = document.createElement('div');
            div.textContent = `${key}: ${temp[key]}`;
            div.classList.add('col-sm');

            // Handle "Status" and "Parking" conditions
            if (key === "Status" && temp[key] === "Bought") {
                goatCountBrought += parseInt(temp['Count']);
                li.classList.add('bg-success');
            }

            if (key === "Status" && temp[key] === "Waiting") {
                goatCountWaiting += parseInt(temp['Count']);
            }

            // Increment the parking count if "Parking" is true
            if (key === "Parking" && temp[key] === true) {
                parkingCount += parseInt(temp['Count']);
            }

            li.appendChild(div);
        });

        goatCount += parseInt(temp['Count']);

        // Adding click event listener to li
        li.addEventListener('click', () => {
            // Populate modal fields with li values
            document.getElementById('updateId').value = li.id;
            document.getElementById('updateFlatNo').value = temp['Flat No'];
            document.getElementById('updateName').value = temp['Name'];
            document.getElementById('updateCount').value = temp['Count'];
            document.getElementById('updateStatus').value = temp['Status'];

            // Set the Parking radio buttons based on the value of temp['Parking']
            const updateParkingRadios = document.getElementsByName('updateParking');

            // Reset the checked radio buttons (in case they were previously selected)
            updateParkingRadios.forEach(radio => radio.checked = false);

            if (temp['Parking']) {
                // If Parking is true, select the "Parking" radio button
                document.querySelector('input[name="updateParking"][value="Parking"]').checked = true;
            } else {
                // If Parking is false, select the "No Parking" radio button
                document.querySelector('input[name="updateParking"][value="No Parking"]').checked = true;
            }

            // Show the modal
            $('#updateModal').modal('show');
        });

        // Appending li to ul
        ul.appendChild(li);
        count++;
    }

    // Display the goat counts and parking count
    document.getElementById('tGoats').innerText = goatCount;
    document.getElementById('tBGoats').innerText = goatCountBrought;
    document.getElementById('tWGoats').innerText = goatCountWaiting;
    document.getElementById('tParking').innerText = parkingCount; // Display Parking count

    showToast("All records have been loaded", true);
});





// Function to delete data from the database
function deleteData(path) {
    try {
        remove(child(rootRef, `eid/${MaincollectionName}/${path}`))
            .then(() => {
                showToast("Data have been deleted.", true);
                // console.log("Data successfully deleted");
            })
            .catch((error) => {
                showToast("Server Down.", false);

                console.error("Error deleting data: ", error);
            });

    } catch (error) {
        console.error("Unexpected error while deleting data: ", error);
    }
}


document.getElementById('addCol').addEventListener('click', async () => {
    let collectionName = $('#newCollectionName').val()
    if (collectionName !== '') {
        MaincollectionName = collectionName
        // showToast('To Create new collection, add a data', true)
        // $('#exampleModal').modal('show');
        // console.log(collectionName)
        let a = await initialData(collectionName);
        console.log(a)
        generateCollectionButtons();
    } else {
        console.log("this calles")
        // showToast("Use write Collection Name",false)
    }
    // $('#addCollectionModal').modal('');

})
document.getElementById('Delete').addEventListener('click', async () => {
    // Get the updated values from the modal fields
    const updateId = document.getElementById('updateId').value;
    try {

        let res = await deleteData(updateId)
    } catch (error) {
        console.log("errrorr")
        console.log(error)
    }

    document.getElementById('search').click()
    $('#updateModal').modal('hide');

});

document.getElementById('updateSubmit').addEventListener('click', () => {
    // Get the updated values from the modal fields
    const updateId = document.getElementById('updateId').value;
    const updateFlatNo = document.getElementById('updateFlatNo').value;
    const updateName = document.getElementById('updateName').value;
    const updateCount = document.getElementById('updateCount').value;
    const updateStatus = document.getElementById('updateStatus').value;
    // Get the parking value (true if "Parking" is selected, false if "No Parking" is selected)
    const isParking = document.querySelector('input[name="updateParking"]:checked') ?
        document.querySelector('input[name="updateParking"]:checked').value === "Parking" : false;
    if (!updateFlatNo || !updateName || !updateCount || !updateStatus) {
        showToast("Please fill in all the fields.", false);
        return;
    }

    // Create the data object
    var data = {
        "Flat No": updateFlatNo,
        "Name": updateName,
        "Count": updateCount,
        "Status": updateStatus,
        "Parking": isParking // true if Parking, false if No Parking
    };


    const updates = {
        [updateId]: JSON.stringify(data)
    };

    // Call the updateData function with the updates
    updateData(updates)
        .then(message => {
            showToast("Data have been Updated.", true);
            // alert(message); // Display success message
        })
        .catch(error => {
            showToast("Error in updating .", false);
            // alert("Error updating data: " + error); // Display error message
        });
    document.getElementById('search').click()
    $('#updateModal').modal('hide');

});

document.getElementById('modelSubmit').addEventListener('click', async () => {
    var flatNo = document.getElementById('flatNo').value;
    var name = document.getElementById('name').value;
    var count = document.getElementById('count').value;
    var status = document.getElementById('status').value;

    // Get the radio button value for Parking (true or false)
    var isParking = document.querySelector('input[name="parking"]:checked') ? document.querySelector('input[name="parking"]:checked').value === "Parking" : false;

    // Prepare the data object
    var data = {
        "Flat No": flatNo,
        "Name": name,
        "Count": count,
        "Status": status,
        "Parking": isParking // Set parking to true if "Parking" is selected, otherwise false
    };


    const jsonData = JSON.stringify(data);
    await writeData(jsonData)



    // $('#exampleModal').modal('hide');
    document.getElementById('search').click()
    // Clear input fields after saving
    document.getElementById('flatNo').value = '';
    document.getElementById('name').value = '';
    document.getElementById('count').value = '';
    document.getElementById('status').value = 'Active'; // Reset status to default
    generateCollectionButtons();
})


// Function to test Firebase connection
function testConnection() {
    return get(child(rootRef, '/')).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Connection successful!");
            return { status: true, msg: "Connection successful!" };
        } else {
            console.log("Connected but no data found.");
            return { status: false, msg: "Connected but no data found." };
        }
    }).catch((error) => {
        console.error("Connection failed: ", error);
        return { status: false, msg: "Connection failed: " + error };
    });
}

// Example usage
// testConnection().then(result => alert(result.msg));




function getCollections() {
    return get(child(rootRef, 'eid/')).then((snapshot) => {
        if (snapshot.exists()) {
            return Object.keys(snapshot.val());
        } else {
            showToast("No data available.", false);
            console.log("No data available");
            return [];
        }
    }).catch((error) => {
        showToast("Server Down", false);

        console.error("Error fetching collections: ", error);
        return [];
    });
}
// Function to dynamically generate collection buttons
async function generateCollectionButtons() {
    try {
        const collections = await getCollections(); // Fetch collection names

        const buttonGroup = document.getElementById('button-addon4');
        buttonGroup.innerHTML = ''; // Clear any existing buttons

        if (Array.isArray(collections)) {
            collections.forEach((collectionName) => {
                // Create a new button for each collection
                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-outline-primary', 'm-1');
                btn.textContent = collectionName;

                // Attach click event to each button
                btn.addEventListener('click', (e) => {
                    // Reset all buttons to outlined before changing the selected one
                    const allButtons = buttonGroup.querySelectorAll('button');
                    allButtons.forEach(button => {
                        button.classList.remove('btn-primary');
                        button.classList.add('btn-outline-primary');
                    });

                    // Change the clicked button to filled primary
                    e.target.classList.remove('btn-outline-primary');
                    e.target.classList.add('btn-primary');

                    // Show the Get All and Add buttons when a collection is selected
                    document.getElementById('action-buttons').style.display = 'block';
                    MaincollectionName = collectionName;
                    showToast(`${MaincollectionName} List have been selected`, true);
                    document.getElementById('search').click();

                    console.log(`Selected collection: ${collectionName}`);
                });

                // Append the button to the button group
                buttonGroup.appendChild(btn);
            });
        } else {
            console.log("No collections found or error occurred");
        }
    } catch (error) {
        console.error("Error generating collection buttons: ", error);
    }
}



function showToast(message, isSuccess) {
    const toastContainer = document.querySelector('.toast-container');

    // Create the toast element
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add(isSuccess ? 'bg-success' : 'bg-danger');
    toast.classList.add('text-white');
    toast.classList.add('m-2');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Set the toast message content
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="mr-auto">${isSuccess ? 'Success' : 'Error'}</strong>
            <small>just now</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    // Append the toast to the container
    toastContainer.appendChild(toast);

    // Initialize and show the toast using Bootstrap's JS methods
    $(toast).toast({ delay: 3000 });
    $(toast).toast('show');
}
// showToast('Your operation was successful!', true);





// Call the function to generate buttons on page load
generateCollectionButtons();
