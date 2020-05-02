import { IFirstTimeInitRepository } from "../repositories/FirstTimeInitRepository";
import { ICategoriesRepository } from "../repositories/CategoriesRepository";
import { ICategoryColorsRepository } from "../repositories/CategoryColorsRepository";
import { Locale } from "../../interface/locale/Locale";

export class DefaultCategoriesService {
    constructor(
        private firstTimeInitRepository: IFirstTimeInitRepository,
        private categoriesRepository: ICategoriesRepository,
        private colorsRepository: ICategoryColorsRepository
    ) {
    }

    public ensureCategoriesAreSetUp(locale: Locale) {
        const firstTimeInit = this.firstTimeInitRepository.get();
        if (!firstTimeInit.areCategoriesSetUp) {

            this.getDefaultCategories(locale).forEach(category => this.categoriesRepository.add(category.name, category.color));

            this.firstTimeInitRepository.set({
                ...firstTimeInit,
                areCategoriesSetUp: true
            });
        }
    }

    private getDefaultCategories(locale: Locale) {
        const colors = this.colorsRepository.get();
        return [
            { name: locale.lunchCategory, color: colors[0] },
            { name: locale.groceriesCategory, color: colors[1] },
            { name: locale.householdCategory, color: colors[2] },
            { name: locale.entertainmentCategory, color: colors[3] },
            { name: locale.clothingCategory, color: colors[4] },
            { name: locale.transportationCategory, color: colors[5] },
            { name: locale.restaurantsCategory, color: colors[6] },
            { name: locale.sportCategory, color: colors[7] },
            { name: locale.healthCategory, color: colors[8] },
            { name: locale.otherCategory, color: colors[9] },
        ]
    }
}