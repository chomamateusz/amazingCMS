export class FirebaseAuth{
    constructor(){
        this.user = false;
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

    login(email, password){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    autoAuth(){
        return firebase.auth().signInWithEmailAndPassword('kontakt@amazingdesign.eu', 'jebacbiede');
    }

    logout(){
        return firebase.auth().signOut();
    }
}