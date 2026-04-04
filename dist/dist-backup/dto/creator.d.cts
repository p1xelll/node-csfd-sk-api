import { CSFDScreening } from "./global.cjs";

//#region src/dto/creator.d.ts
interface CSFDCreator {
  id: number;
  name: string;
  birthday: string | null;
  birthplace: string;
  photo: string;
  age: number | string;
  bio: string;
  films: CSFDCreatorScreening[];
}
type CSFDCreatorScreening = Omit<CSFDScreening, 'url' | 'type'>;
//#endregion
export { CSFDCreator, CSFDCreatorScreening };
//# sourceMappingURL=creator.d.cts.map