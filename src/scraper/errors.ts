import {ElementError} from '../parser/helpers';

export const couldntClick = (selector: string, err: any) =>
  new ElementError(`Couldn't click on '${selector}' element: ${err}`);

export const appDoesntExist = (appID: number) =>
  new ElementError(`App ${appID} doesn't exist`);
