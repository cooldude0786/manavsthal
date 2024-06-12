// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, child, get, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
function readData() {
    return get(child(rootRef, `eid/2k24/`)).then((snapshot) => {
        if (snapshot.exists()) {
            // Return the value here
            return snapshot.val();
        } else {
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
    push(child(rootRef, 'eid/2k24/'), data)
        .then(() => {
            return "Data successfully written to the database";
        })
        .catch((error) => {
            return "Error writing data to the database: " + error;
        });
}


// Function to update data in the database
function updateData(updates) {
    return update(child(rootRef, 'eid/2k24/'), updates)
        .then(() => {
            return "Data successfully updated";
        })
        .catch((error) => {
            throw "Error updating data: " + error;
        });
}


// Function to delete data from the database
function deleteData() {
    remove(ref(rootRef, 'path/to/data'))
        .then(() => {
            console.log("Data successfully deleted");
        })
        .catch((error) => {
            console.error("Error deleting data: ", error);
        });
} document.getElementById('search').addEventListener('click', async () => {
    const val = await readData();
    const ul = document.querySelector('.list-group'); // Selecting the ul element

    const sortedVal = Object.entries(val)
        .map(([key, value]) => ({ id: key, ...JSON.parse(value) }))
        .sort((a, b) => {
            const [aPrefix, aNumber] = a["Flat No"].split('-');
            const [bPrefix, bNumber] = b["Flat No"].split('-');

            if (aPrefix !== bPrefix) {
                return aPrefix.localeCompare(bPrefix);
            }

            return parseInt(aNumber) - parseInt(bNumber);
        });

    // Clearing previous list items
    ul.innerHTML = '';
    let count = 1;
    let goatCount = 0;
    let goatCountBrougth = 0;
    let goatCountWaiting = 0;
    for (let i in sortedVal) {
        let temp = sortedVal[i];

        // Creating li element
        let li = document.createElement('li');
        li.setAttribute('id', temp['id'])
        li.classList.add('align-items-center', 'd-flex', 'flex-wrap', 'justify-content-between', 'list-group-item', 'p-2', 'w-100');

        let div = document.createElement('div');
            div.textContent = `Sr. No.: ${count}`;
            li.appendChild(div);
            
            

        // Creating and appending div elements with data
        ['Flat No', 'Name', 'Count', 'Status'].forEach(key => {
            let div = document.createElement('div');
            div.textContent = `${key}: ${temp[key]}`;
            div.classList.add('col-sm');
            if (key === "Status" && temp[key] === "Bought") {
                goatCountBrougth = goatCountBrougth + parseInt(temp['Count'])

                li.classList.add('bg-success');
            }
            li.appendChild(div);
        });

        goatCount += parseInt(temp['Count']);
        if (temp['Status'] == 'Waiting') {
            goatCountWaiting = goatCountWaiting + parseInt(temp['Count'])
        }

        // Adding click event listener to li
        li.addEventListener('click', () => {
            // Populate modal fields with li values
            document.getElementById('updateId').value = li.id;
            document.getElementById('updateFlatNo').value = temp['Flat No'];
            document.getElementById('updateName').value = temp['Name'];
            document.getElementById('updateCount').value = temp['Count'];
            document.getElementById('updateStatus').value = temp['Status'];

            // Show the modal
            $('#updateModal').modal('show');
        });

        // Appending li to ul
        ul.appendChild(li);
        count++;
    }
    document.getElementById('tGoats').innerText = goatCount;
    document.getElementById('tBGoats').innerText = goatCountBrougth;
    document.getElementById('tWGoats').innerText = goatCountWaiting;
});


document.getElementById('updateSubmit').addEventListener('click', () => {
    // Get the updated values from the modal fields
    const updateId = document.getElementById('updateId').value;
    const updateFlatNo = document.getElementById('updateFlatNo').value;
    const updateName = document.getElementById('updateName').value;
    const updateCount = document.getElementById('updateCount').value;
    const updateStatus = document.getElementById('updateStatus').value;

    // Construct the updates object
    var data = {
        "Flat No": updateFlatNo,
        "Name": updateName,
        "Count": updateCount,
        "Status": updateStatus
    }
    const updates = {
        [updateId]: JSON.stringify(data)
    };

    // Call the updateData function with the updates
    updateData(updates)
        .then(message => {
            alert(message); // Display success message
        })
        .catch(error => {
            alert("Error updating data: " + error); // Display error message
        });
    document.getElementById('search').click()
        $('#updateModal').modal('hide');

});

document.getElementById('modelSubmit').addEventListener('click', async () => {
    var flatNo = document.getElementById('flatNo').value;
    var name = document.getElementById('name').value;
    var count = document.getElementById('count').value;
    var status = document.getElementById('status').value;

    var data = {
        "Flat No": flatNo,
        "Name": name,
        "Count": count,
        "Status": status
    };

    const jsonData = JSON.stringify(data);
    await writeData(jsonData)
    // alert("Data Entered:\n" + data);
    // Close the modal
    $('#exampleModal').modal('hide');
    document.getElementById('search').click()
    // Clear input fields after saving
    document.getElementById('flatNo').value = '';
    document.getElementById('name').value = '';
    document.getElementById('count').value = '';
    document.getElementById('status').value = 'Active'; // Reset status to default
})