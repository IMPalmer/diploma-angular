import { Component, OnInit } from '@angular/core';
import {UserModel} from '@models/user';
import {AuthService} from '@services/auth.service';
import {GeneratedFilesService} from '@services/generated-files.service';
import {DescriptionOfGeneratedFile} from '@models/description-of-generated-file';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUser: UserModel = this.auth.user;
  creatUserDateTime = new Date(this.currentUser.createDateTime).toUTCString();

  generatedFiles: DescriptionOfGeneratedFile[] = [];

  constructor(private auth: AuthService, private generated: GeneratedFilesService) {
  }

  ngOnInit(): void {
    this.generated.getGeneratedFiles(this.generatedFiles).subscribe();
  }

}
