import { Injectable } from '@angular/core';
import { DataSendService } from '../../../core/services/data-send.service';
import { DataStoreService } from '../../../core/services/data-store.service';
import { BaseRepository } from '../../base/base-repository';
import { ViewMotionCommentSection } from '../models/view-motion-comment-section';
import { MotionCommentSection } from '../../../shared/models/motions/motion-comment-section';
import { Group } from '../../../shared/models/users/group';
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
export class MotionCommentSectionRepositoryService extends BaseRepository<
    ViewMotionCommentSection,
    MotionCommentSection
> {
    /**
     * Creates a CategoryRepository
     * Converts existing and incoming category to ViewCategories
     * Handles CRUD using an observer to the DataStore
     * @param DataSend
     */
    public constructor(
        protected DS: DataStoreService,
        mapperService: CollectionStringModelMapperService,
        private dataSend: DataSendService
    ) {
        super(DS, mapperService, MotionCommentSection, [Group]);
    }

    protected createViewModel(section: MotionCommentSection): ViewMotionCommentSection {
        const read_groups = this.DS.getMany(Group, section.read_groups_id);
        const write_groups = this.DS.getMany(Group, section.write_groups_id);
        return new ViewMotionCommentSection(section, read_groups, write_groups);
    }

    public async create(section: MotionCommentSection): Promise<Identifiable> {
        return await this.dataSend.createModel(section);
    }

    public async update(section: Partial<MotionCommentSection>, viewSection?: ViewMotionCommentSection): Promise<void> {
        let updateSection: MotionCommentSection;
        if (viewSection) {
            updateSection = viewSection.section;
        } else {
            updateSection = new MotionCommentSection();
        }
        updateSection.patchValues(section);
        await this.dataSend.updateModel(updateSection);
    }

    public async delete(viewSection: ViewMotionCommentSection): Promise<void> {
        await this.dataSend.deleteModel(viewSection.section);
    }
}
