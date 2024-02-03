// import { IPhoto } from './photo.interface';

import { ITakenIntoAccount } from './takenIntoAccount.interface';

export interface IProductToQuote {
  id?: string;
  name: string;
  description?: string;
  takenIntoAccount: Array<ITakenIntoAccount>;
  // photos: IPhoto[];
}
