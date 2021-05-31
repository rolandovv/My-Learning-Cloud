import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showControl: boolean;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.currentMessage.subscribe(message => this.showControl = message);
  }

  newMessage(message: any) {
    this.userService.changeMessage(message);
  }

  navegateHome() {
    this.router.navigate(['/home']);
  }
  myAccount() {

    this.router.navigate(['/home/userprofile']);
  }
  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
    this.newMessage(false);
  }

}
