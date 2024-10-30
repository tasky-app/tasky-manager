export interface Contract {
    addressId: string;
    clientId: string;
    code: string;
    createAt: string;
    date: string;
    endImage: string;
    hourEnd: string;
    hourStart: string;
    hourStartService: string;
    hoursOfService: string;
    id: string;
    isRated: boolean;
    messages: Message[];
    reasonCancell: string;
    startImage: string;
    stateService: string;
    subcategoryId: string;
    taskerId: string;
    transactionId: string;
    typeMembership: string;
    updateAt: string;
    [key: string]: any;
}

interface Message {
    content: string;
    date: number;
    id: string;
    sender: string;
    type: string;
}