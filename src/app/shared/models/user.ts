import {TokensPairModel} from '@models/tokens-pair';

export interface UserModel extends TokensPairModel{
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createDateTime: Date;
}
