import * as firebase from 'firebase';

export class FirebaseAuth {
  constructor() {
    this.user = false;
    this.initializeFirebase();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        console.log('FIREBASE-AUTH User is signed in', user);
      } else {
        this.user = false;
        console.log('FIREBASE-AUTH No user is signed in');
      }
    });
  }

  initializeFirebase() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCyyvpDENphJFC3Te0xkGkT6RXEodOHCcM",
      authDomain: "dajsiepoznac2017.firebaseapp.com",
      databaseURL: "https://dajsiepoznac2017.firebaseio.com",
      storageBucket: "dajsiepoznac2017.appspot.com",
      messagingSenderId: "1042862032532"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  autoAuth() {
    return firebase.auth().signInWithEmailAndPassword('kontakt@amazingdesign.eu', 'jebacbiede');
  }

  logout() {
    return firebase.auth().signOut();
  }
}
