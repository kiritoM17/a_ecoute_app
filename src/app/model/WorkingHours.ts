class StoreTime{
    public hour: number;
    public minute: number;
}

export class WorkingHours{
    public active: boolean;
    public open: StoreTime;
    public close: StoreTime;
}