import {
  inject
} from "aurelia-framework";
import{FirebaseAuth} from 'firebaseAuth';

@inject(FirebaseAuth)
export class Login{
    constructor(firebaseAuth){
        this.firebaseAuth = firebaseAuth;
    }

    login(){
        this.firebaseAuth.login(this.email, this.password).then(()=>{
            this.loginError =  '';
            console.log('LOGIN - logged successfully!');
        }).catch(()=>{
            this.loginError = 'Niepoprawne dane logowania!'
            console.log('LOGIN - logged UNsuccessfully!');
        });
    }
}