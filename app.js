// Initialize Firebase
var config = {
    apiKey: "AIzaSyA65egZU9kkkA3yu9B_wfJBGoO1wU7sfyU",
    authDomain: "pilve-cafe.firebaseapp.com",
    databaseURL: "https://pilve-cafe.firebaseio.com",
    projectId: "pilve-cafe",
    storageBucket: "pilve-cafe.appspot.com",
    messagingSenderId: "627852924046"
};
firebase.initializeApp(config);
const db = firebase.firestore();


const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create element and render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('p');
    let cross = document.createElement('i');
    let ikoon = document.createElement('i');
    let a = document.createElement('a');

    li.classList.add("collection-item")
    li.classList.add("avatar")
    name.classList.add("title")
    cross.classList.add("material-icons")
    cross.classList.add("secondary-content")
    ikoon.classList.add("material-icons")
    ikoon.classList.add("circle")

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'delete';
    ikoon.textContent = 'arrow_forward';

    li.appendChild(ikoon);
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}

// getting data
// db.collection('cafes').where('city', '==', 'Tallinn').orderBy('name').get().then((snapshot) => {
// db.collection('cafes').orderBy('city').get().then((snapshot) => {

// db.collection('cafes').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// })

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    })
    form.name.value = '';
    form.city.value = '';
})


// Real time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})