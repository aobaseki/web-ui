import { Model } from '@nozbe/watermelondb';
import {field, date, children, readonly} from '@nozbe/watermelondb/decorators';
import auditSchema from "./auditSchema";
import { Q } from '@nozbe/watermelondb';

export default class Audits extends Model {
    static table = 'audits';
    static deletable = false;

    static associations = {
        auditEntries: { type: 'has_many', key: 'auditId' },
    };

    static displayColumn = 'id';

    @field('branchId') branchId;
    @field('createdBy') createdBy;
    @children('auditEntries') audit_entries;

    @readonly @date('created_at') createdAt;
    @readonly @date('updated_at') updatedAt;

    auditEntries = this.collections
        .get('auditEntries')
        .query(Q.where('auditId' , this.id));

    static columns = auditSchema.columns.map(c => c.name);
}