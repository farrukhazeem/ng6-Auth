import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
declare let $;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
    
  }


  logout() {
      this.auth.logout();
  }

  ngOnInit() {

    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
  }

}
