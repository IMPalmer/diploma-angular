enum FileFormat {
  doc = 0,
}

export interface ExpertCommissionProtocolOfMeetingModel{
  format: FileFormat;
  actCopyNumber: number;
  facultyNumber: number;
  protocolCreationDate: Date;
  headOfTheCommissionName: string;
  secretaryOfTheCommissionName: string;
  membersOfTheCommissionNames: string[];
  speakersOfTheCommissionName: string[];
  publishingNameWithItsStatics: string;
  isPublicationAStateSecret: boolean;
  doesPubliscationContainServiceInformation: boolean;
  descriptionOfStateSecrectsOrServiceInformation: string;
  doesCommissionAllowAIssuingOfThePublication: boolean;
  chiefOfSecurityDepartment: string;
}
