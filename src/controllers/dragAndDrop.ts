import { BendingOption } from '../_enums';
import { BaseControllerParams } from '../_types';
import { AddImageFunc } from '../actions/addImage';

type DragAndDropControllerParams = BaseControllerParams & {
    addImage: AddImageFunc;
    dropAreaElem: HTMLUListElement;
};

const classNames = {
    mods: {
        visible: 'drop-area_visible_yes',
        semiVisible: 'drop-area_visible_semi',
    },
    item: 'drop-area__item',
};

const bendingOptionsMap = {
    normal: BendingOption.Normal,
    difference: BendingOption.Difference,
};

export function createDragAndDropController(params: DragAndDropControllerParams) {
    const { store, addImage, dropAreaElem } = params;
    let isVisible = false;

    function show() {
        isVisible = true;
        dropAreaElem.classList.add(classNames.mods.visible);
    }

    function hide() {
        isVisible = false;
        dropAreaElem.classList.add(classNames.mods.semiVisible);
        dropAreaElem.classList.remove(classNames.mods.visible);
        setTimeout(() => dropAreaElem.classList.remove(classNames.mods.semiVisible), 300);
    }

    function getBendingOptionFromCoord(y: number): BendingOption {
        const items = dropAreaElem.querySelectorAll<HTMLLIElement>('.' + classNames.item);
        const elem: HTMLLIElement | void = [].find.call(items, (elem) => elem.offsetTop + elem.offsetHeight > y);
        const optionString = elem ? elem.getAttribute('data-type') : '';
        return bendingOptionsMap[optionString] || bendingOptionsMap.normal;
    }

    document.body.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (!isVisible) {
            show();
        }
    });

    dropAreaElem.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (isVisible) {
            hide();
        }
    });

    dropAreaElem.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    dropAreaElem.addEventListener('drop', async (e) => {
        e.preventDefault();
        hide();

        addImage(store, e.dataTransfer.files[0], {
            bendingOption: getBendingOptionFromCoord(e.clientY),
            coords: {
                x: e.clientX,
                y: e.clientY,
            },
        });
    });
}
