import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constant/types";
import { CategoryRepository } from "../repository/category.repository";
import { ICategory, ICategoryModel } from "../model/Category";

@injectable()
export class CategoryService {
  //extends ServiceBase<IUserModel>
  private categoryRepository: CategoryRepository;

  public constructor(@inject(TYPES.CategoryRepository) reposetory: CategoryRepository) {
    this.categoryRepository = reposetory;
  }

  getById(id: string): Promise<ICategoryModel> {
      return this.categoryRepository.findById(id);
  }
}
