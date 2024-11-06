import { Timestamp } from "@google-cloud/firestore";

export enum StateContract {
    inprogress = 'inprogress',
    pending = 'pending',
    confirmed = 'confirmed',
    finished = 'finished',
    cancel = 'cancel',
    decline = 'decline',
}

export class Message {
    content: string;
    date: Timestamp;
    id: string;
    sender: string;
    type: string;

    constructor(data: {
        content: string,
        date: Timestamp,
        id: string,
        sender: string,
        type: string
    }) {
        this.content = data.content;
        this.date = data.date;
        this.id = data.id;
        this.sender = data.sender;
        this.type = data.type;
    }

    static fromJson(json: any): Message {
        return new Message({
            content: json['content'] || '',
            date: json['date'] || '',
            id: json['id'] || '',
            sender: json['sender'] || '',
            type: json['type'] || '',
        });
    }
}

export class Contracts {
    static collectionName = 'contracts';

    id: string;
    StateContract: StateContract;
    clientId: string;
    taskerId: string;
    addressId: string;
    date: string;
    subcategoryId: string;
    hoursOfService: string;
    startImage: string;
    endImage: string;
    code: string;
    hourStart: string;
    hourEnd: string;
    isRated: boolean;
    messages: Message[];
    reasonCancell?: string;
    createAt: string;
    updateAt: string;
    transactionId: string;
    hourStartService: string;
    typeMembership: string;

    constructor(data: {
        id: string;
        StateContract: StateContract;
        clientId: string;
        taskerId: string;
        addressId: string;
        date: string;
        subcategoryId: string;
        hoursOfService: string;
        startImage: string;
        endImage: string;
        code: string;
        hourStart: string;
        hourEnd: string;
        isRated: boolean;
        messages: Message[];
        reasonCancell?: string;
        createAt: string;
        updateAt: string;
        transactionId: string;
        hourStartService: string;
        typeMembership: string;
    }) {
        this.id = data.id;
        this.StateContract = data.StateContract;
        this.clientId = data.clientId;
        this.taskerId = data.taskerId;
        this.addressId = data.addressId;
        this.date = data.date;
        this.subcategoryId = data.subcategoryId;
        this.hoursOfService = data.hoursOfService;
        this.startImage = data.startImage;
        this.endImage = data.endImage;
        this.code = data.code;
        this.hourStart = data.hourStart;
        this.hourEnd = data.hourEnd;
        this.isRated = data.isRated;
        this.messages = data.messages;
        this.reasonCancell = data.reasonCancell;
        this.createAt = data.createAt;
        this.updateAt = data.updateAt;
        this.transactionId = data.transactionId;
        this.hourStartService = data.hourStartService;
        this.typeMembership = data.typeMembership;
    }

    static fromJson(json: any): Contracts {
        return new Contracts({
            id: json['id'] || '',
            StateContract: StateContract[json['StateContract'] as keyof typeof StateContract] || StateContract.pending,
            clientId: json['clientId'] || '',
            taskerId: json['taskerId'] || '',
            addressId: json['addressId'] || '',
            date: json['date'] || '',
            subcategoryId: json['subcategoryId'] || '',
            hoursOfService: json['hoursOfService'] || '',
            startImage: json['startImage'] || '',
            endImage: json['endImage'] || '',
            code: json['code'] || '',
            hourStart: json['hourStart'] || '',
            hourEnd: json['hourEnd'] || '',
            isRated: json['isRated'] || false,
            messages: json['messages'] ? json['messages'].map((msg: any) => Message.fromJson(msg)) : [],
            reasonCancell: json['reasonCancell'],
            createAt: json['createAt'] || '',
            updateAt: json['updateAt'] || '',
            transactionId: json['transactionId'] || '',
            hourStartService: json['hourStartService'] || '',
            typeMembership: json['typeMembership'] || '',
        });
    }
}

