
// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    storageBucket: "urbangrow-93345.appspot.com",
    authDomain: "urbangrow-93345.firebaseapp.com",
    apiKey: "AIzaSyAFwRwpG9B5yWLKY3A9saZkPu8RC34vgeY",
    projectId: "urbangrow-93345",
    measurementId: "G-TC8TSSK2M8",
    appId: "1:125650021444:web:b47b245ab333ea7cb96011",
    messagingSenderId: "125650021444",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function submitData() {
    db.collection("registers")
        .add({
            name : form.children[0].querySelector('input').value,
            email: form.children[1].querySelector('input').value,
            phone: form.children[2].querySelector('input').value.replace(/[^0-9]/g, ''),
            count: form.children[3].querySelector('input').value,
            date : Date.now(),
            dev  : navigator.userAgent,
        })
        .then((docRef) => { console.log('Success!'); })
        .catch((error) => {
            formAlert('Please check your internet connection!');
        });

}
window.submitData = submitData;
