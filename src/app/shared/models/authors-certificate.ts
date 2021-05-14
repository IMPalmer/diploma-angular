enum FileFormat {
  doc = 0,
}

export interface AuthorsModel{
  fullName: string;
  degrees: Array<string>;
}

export interface AuthorsCertificateModel{
  format: FileFormat;
  authors: Array<AuthorsModel>;
  publishingNameWithItsStatics: string;
  publishingHouse: string;
  publishingDate: Date;
  universityDepartmentName: string;
  fullNameOfChiefOfUniversityDepartment: string;
}
