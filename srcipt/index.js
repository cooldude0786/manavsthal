// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, child, get, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


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
    update(ref(rootRef, 'eid/2k24/'), updates)
        .then(() => {
            return "Data successfully updated";
        })
        .catch((error) => {
            return "Error updating data: " + error;
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
}
document.getElementById('search').addEventListener('click', async () => {
    const val = await readData();
    const ul = document.querySelector('.list-group'); // Selecting the ul element

    // Clearing previous list items
    ul.innerHTML = '';

    for (let i in val) {
        let temp = JSON.parse(val[i]);

        // Creating li element
        let li = document.createElement('li');
        li.setAttribute('id', i)
        li.classList.add('align-items-center', 'd-flex', 'flex-wrap', 'justify-content-between', 'list-group-item', 'p-2', 'w-100');

        // Creating and appending div elements with data
        ['Flat No', 'Name', 'Count', 'Status'].forEach(key => {
            let div = document.createElement('div');
            div.textContent = `${key}: ${temp[key]}`;
            li.appendChild(div);
        });

        // Appending li to ul
        ul.appendChild(li);
    }
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