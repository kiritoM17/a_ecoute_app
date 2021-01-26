export interface IReceiverInformation {
    fullName: string;
    mobile: string;
}

export class ReceiverInformation implements IReceiverInformation {
    constructor(
        public fullName: string,
        public mobile: string,
    ) { }
}