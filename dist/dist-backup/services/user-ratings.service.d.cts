import { CSFDUserRatingConfig, CSFDUserRatings } from "../dto/user-ratings.cjs";
import { CSFDOptions } from "../dto/options.cjs";

//#region src/services/user-ratings.service.d.ts
declare class UserRatingsScraper {
  userRatings(user: string | number, config?: CSFDUserRatingConfig, options?: CSFDOptions): Promise<CSFDUserRatings[]>;
  private getPage;
  private buildUserRatings;
}
//#endregion
export { UserRatingsScraper };
//# sourceMappingURL=user-ratings.service.d.cts.map