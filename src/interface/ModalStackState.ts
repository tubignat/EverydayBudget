import { observable, action, computed } from "mobx";

type RenderModal = (onClose: () => void) => JSX.Element

class ModalStackStateImpl {

    @action public open(render: RenderModal) {
        const id = Date.now();
        this.modals.set(id, () => render(() => this.close(id))
        );
    }

    @action public setMainViewStyle(containerStyle: any, contentStyle: any) {
        this.mainViewStyleInner = containerStyle;
        this.mainViewContentStyleInner = contentStyle;
    }

    @action private close(id: number) {
        if (!this.modals.has(id)) {
            return;
        }

        this.modals.delete(id);
    }

    @computed get registeredModals() {
        return Array.from(this.modals.values())
    }

    @computed get mainViewStyle(): any {
        return this.mainViewStyleInner;
    }

    @computed get mainViewContentStyle(): any {
        return this.mainViewContentStyleInner;
    }

    @observable
    private modals: Map<number, () => JSX.Element> = new Map();

    @observable
    private mainViewStyleInner: any = {}

    @observable
    private mainViewContentStyleInner: any = {}
}

export const ModalStackState = new ModalStackStateImpl();