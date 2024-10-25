
import { Membership } from 'src/app/enums/membership';
import { Gender } from 'src/app/enums/gender';
import { IdentificationType } from 'src/app/enums/document_type';

export class SubcategoryPrice {
    subcategoryId: string;
    subcategoryName: string;
    categoryId: string;
    price: number;

    constructor(data: {
        subcategoryId: string;
        subcategoryName: string;
        categoryId: string;
        price: number;
    }) {
        this.subcategoryId = data.subcategoryId;
        this.subcategoryName = data.subcategoryName;
        this.categoryId = data.categoryId;
        this.price = data.price;
    }

    static fromJson(json: any): SubcategoryPrice {
        return new SubcategoryPrice({
            subcategoryId: json['subcategoryId'] || '',
            subcategoryName: json['subcategoryName'] || '',
            categoryId: json['categoryId'] || '',
            price: json['price'] || 123,
        });
    }
}

export class Tasker {
    static collectionName = 'taskers';

    id: string;
    phoneExtension: string;
    phoneNumber: string;
    email: string;
    firstname: string;
    lastname: string;
    documentType: IdentificationType;
    documentNumber: string;
    membership: Membership;
    gender: Gender;
    biography: string;
    experience: string;
    birthdate: string;
    isVerified: boolean;
    isActive: boolean;
    documentPicture: string;
    profilePicture: string;
    qualification: number;
    subcategoryPrices: SubcategoryPrice;
    isPayed: boolean;
    password: string;
    bank: string;
    bankAccount: string;
    deviceId: string;
    country: string;
    city: string;
    createAt: string;
    updateAt: string;
    membershipRedeemable: boolean;
    version: string;

    constructor(data: {
        id: string;
        phoneExtension: string;
        phoneNumber: string;
        email: string;
        firstname: string;
        lastname: string;
        documentType: IdentificationType;
        documentNumber: string;
        membership: Membership;
        gender: Gender;
        biography: string;
        experience: string;
        birthdate: string;
        isVerified: boolean;
        isActive: boolean;
        documentPicture: string;
        profilePicture: string;
        qualification: number;
        subcategoryPrices: SubcategoryPrice;
        isPayed: boolean;
        password: string;
        bank: string;
        bankAccount: string;
        deviceId: string;
        country: string;
        city: string;
        createAt: string;
        updateAt: string;
        membershipRedeemable: boolean;
        version: string;
    }
    ) {
        this.id = data.id;
        this.phoneExtension = data.phoneExtension;
        this.phoneNumber = data.phoneNumber;
        this.email = data.email;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.documentType = data.documentType;
        this.documentNumber = data.documentNumber;
        this.membership = data.membership;
        this.gender = data.gender;
        this.biography = data.biography;
        this.experience = data.experience;
        this.birthdate = data.birthdate;
        this.isVerified = data.isVerified;
        this.isActive = data.isActive;
        this.documentPicture = data.documentPicture;
        this.profilePicture = data.profilePicture;
        this.qualification = data.qualification;
        this.subcategoryPrices = data.subcategoryPrices;
        this.isPayed = data.isPayed;
        this.password = data.password;
        this.bank = data.bank;
        this.bankAccount = data.bankAccount;
        this.deviceId = data.deviceId;
        this.country = data.country;
        this.city = data.city;
        this.createAt = data.createAt;
        this.updateAt = data.updateAt;
        this.membershipRedeemable = data.membershipRedeemable;
        this.version = data.version;
    };

    static fromJson(json: any): Tasker {
        return new Tasker({
            id: json['id'] || '',
            phoneExtension: json['phoneExtension'] || '',
            phoneNumber: json['phoneNumber'] || '',
            email: json['email'] || '',
            firstname: json['firstname'] || '',
            lastname: json['lastname'] || '',
            documentType: IdentificationType[json['documentType'] as keyof typeof IdentificationType] || IdentificationType.cc,
            documentNumber: json['documentNumber'] || '',
            membership: Membership[json['membership'] as keyof typeof Membership] || Membership.free,
            gender: Gender[json['gender'] as keyof typeof Gender] || Gender.male,
            biography: json['biography'] || '',
            experience: json['experience'] || '',
            birthdate: json['birthdate'] || '',
            isVerified: json['isVerified'] || true,
            isActive: json['isActive'] || true,
            documentPicture: json['documentPicture'] || '',
            profilePicture: json['profilePicture'] || '' || 'defaultProfilePhoto',
            qualification: parseFloat(json['qualification']) || 5.0,
            subcategoryPrices: json['subcategoryPrices']
                ? json['subcategoryPrices'].map((e: any) => SubcategoryPrice.fromJson(e))
                : [],
            isPayed: json['isPayed'] || true,
            password: json['password'] || '',
            bank: json['bank'] || '',
            bankAccount: json['bankAccount'] || '',
            deviceId: json['deviceId'] || '',
            country: json['country'] || '',
            city: json['city'] || '',
            createAt: json['createAt'] || '',
            updateAt: json['updateAt'] || '',
            membershipRedeemable: json['membershipRedeemable'] || false,
            version: json['version'] || '',
        });
    }
}
