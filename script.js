import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
    const firebaseConfig = {
        apiKey: "AIzaSyA6xaZqJmDXIxW0aMACKyXcXIC56AYhXec",
        authDomain: "ryu-wishlist.firebaseapp.com",
        databaseURL: "https://ryu-wishlist-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "ryu-wishlist",
        storageBucket: "ryu-wishlist.appspot.com",
        messagingSenderId: "887344656583",
        appId: "1:887344656583:web:74d3050718c74148068ee2"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app); // Pass the app instance to getDatabase()

    // Function to save checkbox state to Firebase
    function saveCheckboxState(checkboxId, isChecked) {
        set(ref(database, 'checkboxes/' + checkboxId), isChecked);
    }

    // Function to prompt user for confirmation before unchecking a checkbox
    function confirmUncheck(checkbox) {
        return new Promise((resolve, reject) => {
            if (confirm('Sicuro di volerlo rimuovere dalla wishlist?')) {
                resolve(true);
            } else {
                checkbox.checked = true; // Keep the checkbox checked
                resolve(false);
            }
        });
    }

    // Add event listeners to checkboxes to save state when changed
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const checkboxId = checkbox.id;
            const isChecked = checkbox.checked;
            get(ref(database, 'checkboxes/' + checkboxId)).then(snapshot => {
                if (snapshot.exists()) {
                    const previousState = snapshot.val();
                    if (isChecked && !previousState) { // Save only if state changes from false to true
                        saveCheckboxState(checkboxId, isChecked);
                    } else if (!isChecked && previousState) { // Prompt user for confirmation before unchecking
                        confirmUncheck(checkbox).then(result => {
                            if (result) {
                                saveCheckboxState(checkboxId, isChecked);
                            }
                        });
                    }
                } else {
                    saveCheckboxState(checkboxId, isChecked); // If no previous state, save the current state
                }
            }).catch(error => {
                console.error('Error querying checkbox state:', error);
            });
        });
    });

    // Load initial state of checkboxes from Firebase
    get(ref(database, 'checkboxes')).then(snapshot => {
        if (snapshot.exists()) {
            const checkboxData = snapshot.val();
            for (const checkboxId in checkboxData) {
                const isChecked = checkboxData[checkboxId];
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = isChecked;
                }
            }
        }
    }).catch(error => {
        console.error('Error loading checkbox state:', error);
    });

    // Function to query for changes in the database every 10 seconds
    setInterval(function() {
        get(ref(database, 'checkboxes')).then(snapshot => {
            if (snapshot.exists()) {
                const checkboxData = snapshot.val();
                for (const checkboxId in checkboxData) {
                    const isChecked = checkboxData[checkboxId];
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox && checkbox.checked !== isChecked) {
                        checkbox.checked = isChecked;
                    }
                }
            }
        }).catch(error => {
            console.error('Error querying for changes:', error);
        });
    }, 10000); // Run every 10 seconds
});
