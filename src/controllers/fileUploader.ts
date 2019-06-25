import { BendingOption } from '../_enums';
import { BaseControllerParams } from '../_types';
import { AddImageFunc } from '../actions/addImage';

type FileUploaderParams = BaseControllerParams & {
    addImage: AddImageFunc;
    fileElem: HTMLInputElement;
};

export function createFileUploaderController(params: FileUploaderParams) {
    const { store, addImage, fileElem } = params;

    fileElem.addEventListener('input', async (e) => {
        addImage(store, fileElem.files[0], {
            bendingOption: BendingOption.Normal,
            coords: {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            },
        });
    });
}
