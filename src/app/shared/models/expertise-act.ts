import {AuthorsModel} from '@models/authors-certificate';

enum FileFormat {
  doc = 0,
}

export interface CommissionModel{
  fullName: string;
  degrees: Array<string>;
}

export interface ExpertiseActModel{
  format: FileFormat;
  provostName: string;
  actCreationDate: Date;
  facultyNumber: number;
  headOfTheCommission: CommissionModel;
  membersOfTheCommission: Array<CommissionModel>;
  authorsOfThePublication: Array<AuthorsModel>;
  publishingNameWithItsStatics: string;
  secretaryOfTheCommission: string;
  chiefOfSecurityDepartment: string;
}
