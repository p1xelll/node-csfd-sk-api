import { CSFDUserReviews, CSFDUserReviewsConfig } from "../dto/user-reviews.cjs";
import { CSFDOptions } from "../dto/options.cjs";

//#region src/services/user-reviews.service.d.ts
declare class UserReviewsScraper {
  userReviews(user: string | number, config?: CSFDUserReviewsConfig, options?: CSFDOptions): Promise<CSFDUserReviews[]>;
  private getPage;
  private buildUserReviews;
}
//#endregion
export { UserReviewsScraper };
//# sourceMappingURL=user-reviews.service.d.cts.map