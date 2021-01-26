import { Types, Schema } from "mongoose";
import { injectable, unmanaged } from "inversify";

@injectable()
export class RepositoryBase<T> {

    protected _model: any;

    constructor(@unmanaged() schemaModel: any) {
        this._model = schemaModel;
    }

    create(item: T): Promise<T> {
        const newItem = new this._model(item);
        return newItem.save();
    }

    retrieve(): Promise<Array<T>> {
        return this._model.find({});
    }

    update(_id: String, item: T): Promise<T> {
        return this._model.updateOne({ _id: _id }, item).then((result: any) => {
            if (result.ok === 1) {
                return this._model.findById(_id);
            } else {
                return result;
            }
        });
    }

    delete(_id: string): Promise<T> {
        return this._model.remove({ _id: this.toObjectId(_id) }).then((result: any) => {
            return result;
        });
    }

    findById(_id: string): Promise<T> {
        return this._model.findById(this.toObjectId(_id));
    }

    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id)
    }

}
