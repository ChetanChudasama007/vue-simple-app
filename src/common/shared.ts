export default class Shared {
    // set focus to first element which has validation error
    public static setFocusOnValidation(el: HTMLElement): void {
        setTimeout(() => {
            const errorItem: any = el.querySelector(".error--text");
            if (errorItem) {
                errorItem.getElementsByTagName("input")[0].focus();
            }
        }, 0);
    }
}
