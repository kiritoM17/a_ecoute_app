import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constant/types";
import { PackageRepository } from "../repository/package.repository";

@injectable()
export class PackageService {
  private packegeRepository: PackageRepository;

  public constructor(@inject(TYPES.PackegeRepository) reposetory: PackageRepository) {
    this.packegeRepository = reposetory;
  }
}
