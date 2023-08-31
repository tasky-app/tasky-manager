import { Address } from "src/database/entities/Address";

export interface IAddressService   {
    saveAddress(cellphone: string, address: Address);
    getAddress(cellphone: string): Promise<any>;
    getMainAddress(cellphone: string): Promise<any>;
    updateMainAddress(cellphone: string, address: Address);
    deleteAddress(cellphone: string, address: Address);
    getAddressById(addressId: number): Promise<Address>;
}