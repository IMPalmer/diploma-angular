import { DegreeModel } from '@models/degree';

export interface ScientistModel{
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  degrees: Array<DegreeModel>[];
}
