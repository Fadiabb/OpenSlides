import { Injectable } from '@angular/core';
import { Category } from '../../../shared/models/motions/category';
import { ViewCategory } from '../models/view-category';
import { DataSendService } from '../../../core/services/data-send.service';
import { DataStoreService } from '../../../core/services/data-store.service';
import { BaseRepository } from '../../base/base-repository';
import { Motion } from '../../../shared/models/motions/motion';
import { CategoryNumbering } from '../models/category-numbering';
import { HttpService } from '../../../core/services/http.service';
import { Identifiable } from '../../../shared/models/base/identifiable';
import { CollectionStringModelMapperService } from '../../../core/services/collectionStringModelMapper.service';

/**
 * Repository Services for Categories
 *
 * The repository is meant to process domain objects (those found under
 * shared/models), so components can display them and interact with them.
 *
 * Rather than manipulating models directly, the repository is meant to
 * inform the {@link DataSendService} about changes which will send
 * them to the Server.
 */
@Injectable({
    providedIn: 'root'
})
export class CategoryRepositoryService extends BaseRepository<ViewCategory, Category> {
    /**
     * Creates a CategoryRepository
     * Converts existing and incoming category to ViewCategories
     * Handles CRUD using an observer to the DataStore
     * @param DataSend
     */
    public constructor(
        protected DS: DataStoreService,
        mapperService: CollectionStringModelMapperService,
        private dataSend: DataSendService,
        private httpService: HttpService
    ) {
        super(DS, mapperService, Category);
    }

    protected createViewModel(category: Category): ViewCategory {
        return new ViewCategory(category);
    }

    public async create(newCategory: Category): Promise<Identifiable> {
        return await this.dataSend.createModel(newCategory);
    }

    public async update(category: Partial<Category>, viewCategory: ViewCategory): Promise<void> {
        let updateCategory: Category;
        if (viewCategory) {
            updateCategory = viewCategory.category;
        } else {
            updateCategory = new Category();
        }
        updateCategory.patchValues(category);
        await this.dataSend.updateModel(updateCategory);
    }

    public async delete(viewCategory: ViewCategory): Promise<void> {
        const category = viewCategory.category;
        await this.dataSend.deleteModel(category);
    }

    /**
     * Returns all Motions belonging to a category
     * @param category category
     */
    public getMotionsOfCategory(category: Category): Array<Motion> {
        const motList = this.DS.getAll(Motion);
        const retList: Array<Motion> = [];
        motList.forEach(motion => {
            if (motion.category_id && motion.category_id === category.id) {
                retList.push(motion);
            }
        });
        // TODO: Sorting the return List?!
        return retList;
    }

    /**
     * Returns the category for the ID
     * @param category_id category ID
     */
    public getCategoryByID(category_id: number): Category {
        const catList = this.DS.getAll(Category);
        return catList.find(category => category.id === category_id);
    }

    /**
     * Updates a Categories numbering
     * @param category the category it should be updated in
     * @param motionList the list of motions on this category
     */
    public async updateCategoryNumbering(category: Category, motionList: Motion[]): Promise<void> {
        const categoryNumbering = new CategoryNumbering();
        categoryNumbering.setMotions(motionList);
        await this.sentCategoryNumbering(category, categoryNumbering);
    }

    /**
     * Save category in the server
     *
     * @return Observable from
     */
    protected async sentCategoryNumbering(category: Category, categoryNumbering: CategoryNumbering): Promise<void> {
        const collectionString = 'rest/motions/category/' + category.id + '/numbering/';
        await this.httpService.post(collectionString, categoryNumbering);
    }
}
