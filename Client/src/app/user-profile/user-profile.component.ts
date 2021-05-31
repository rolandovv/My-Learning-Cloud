import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userDetails;

  editAccount: boolean = false;
  showSucessMessage: boolean;

  deletionSucessMessage: boolean;

  testingV = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        console.log(this.userDetails);
      },
      err => { 
        console.log(err);
        
      }
    );
  }

  updateUserAccount(){
    this.editAccount = !this.editAccount;
    this.deletionSucessMessage = false;

    //this.userDetails._id = this.returnSingleValue.value.id;
    this.userDetails.firtName = this.userDetails.firtName;
    this.userDetails.lastName = this.userDetails.lastName;

    this.userDetails.email = this.userDetails.email; 
    this.userDetails.dateOfBirth = this.userDetails.dateOfBirth;   

  }

  submitUpdate(form: NgForm) {
      console.log(form.value);
      this.userService.updateUserAccount(this.userDetails._id, this.userDetails).subscribe(
        result => this.gotoUserProfile()
      );
  }

  gotoUserProfile() {
    this.editAccount = !this.editAccount;
    this.showSucessMessage = true;
    setTimeout(() => this.showSucessMessage = false, 4000);
  }
  
  cancelUpdate(){
    this.editAccount = !this.editAccount;
  }

  
  submitDeletion(form: NgForm) {
    this.userService.deleteUserAccount(this.userDetails._id).subscribe(
      result => this.showDeletionSucessMessage()
    );
  }

  showDeletionSucessMessage() {
    this.deletionSucessMessage = true;
    setTimeout(() => this.onLogout(), 4000);    
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
    this.newMessage(false);
  }

  newMessage(message: any) {
    this.userService.changeMessage(message);
  }

}
