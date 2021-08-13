enum FileFormat {
  doc = 0,
}

enum FileType {
  note = 0,
  protocol = 1,
  act = 2,
}

export interface DescriptionOfGeneratedFile {
  name: string;
  type: FileType;
  format: FileFormat;
  creationDate: Date;
}
