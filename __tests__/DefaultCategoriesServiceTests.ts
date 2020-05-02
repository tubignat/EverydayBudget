import { DefaultCategoriesService } from "../src/domain/services/DefaultCategoriesService";
import { CategoryColorsRepository } from "../src/domain/repositories/CategoryColorsRepository";
import { CategoryColor } from "../src/domain/entities/CategoryColor";
import { enLocale } from "../src/interface/locale/EnLocale";
import { FirstTimeInit } from "../src/domain/repositories/FirstTimeInitRepository";

test('defaultCategoriesService should add default categories if categories are not set up', () => {
    const firstTimeInitRepository = new FirstTimeInitRepositoryStub({ areCategoriesSetUp: false });
    const categoriesRepository = new CategoriesRepositoryStub([]);
    const colorsRepository = new CategoryColorsRepository();

    const service = new DefaultCategoriesService(
        firstTimeInitRepository,
        // @ts-ignore
        categoriesRepository,
        colorsRepository
    );

    service.ensureCategoriesAreSetUp(enLocale);

    const colors = colorsRepository.get();

    expect(firstTimeInitRepository.get().areCategoriesSetUp).toBeTruthy();
    expect(categoriesRepository.get()).toStrictEqual([
        { name: enLocale.lunchCategory, color: colors[0] },
        { name: enLocale.groceriesCategory, color: colors[1] },
        { name: enLocale.householdCategory, color: colors[2] },
        { name: enLocale.entertainmentCategory, color: colors[3] },
        { name: enLocale.clothingCategory, color: colors[4] },
        { name: enLocale.transportationCategory, color: colors[5] },
        { name: enLocale.restaurantsCategory, color: colors[6] },
        { name: enLocale.sportCategory, color: colors[7] },
        { name: enLocale.healthCategory, color: colors[8] },
        { name: enLocale.otherCategory, color: colors[9] },
    ]);
})

test('defaultCategoriesService should not add categories if categories are set up', () => {
    const firstTimeInitRepository = new FirstTimeInitRepositoryStub({ areCategoriesSetUp: true });
    const categoriesRepository = new CategoriesRepositoryStub([]);
    const colorsRepository = new CategoryColorsRepository();

    const service = new DefaultCategoriesService(
        firstTimeInitRepository,
        // @ts-ignore
        categoriesRepository,
        colorsRepository
    );

    service.ensureCategoriesAreSetUp(enLocale);

    expect(firstTimeInitRepository.get().areCategoriesSetUp).toBeTruthy();
    expect(categoriesRepository.get()).toStrictEqual([]);
})

class FirstTimeInitRepositoryStub {
    private value: FirstTimeInit;

    constructor(value: FirstTimeInit) {
        this.value = value;
    }

    public get = () => {
        return this.value;
    }

    public set = (newValue: any) => {
        this.value = newValue;
    }
}

class CategoriesRepositoryStub {
    private categories: any[] = []
    constructor(categories: any[]) {
        this.categories = categories;
    }

    add = (name: string, color: CategoryColor) => {
        this.categories.push({ name: name, color: color });
    }

    get = () => this.categories;
}
