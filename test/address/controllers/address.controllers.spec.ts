import {Test, TestingModule} from "@nestjs/testing";
import {AddressController} from '../../../src/address/controllers/address.controller';
import {AddressService} from '../../../src/address/services/address.service';
import {Address} from '../../../src/database/entities/Address';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ContactInfo} from '../../../src/database/entities/ContactInfo';

describe('AddressController', () => {
    let controller: AddressController;
    let service: AddressService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AddressController],
            providers: [AddressService,
                {
                    provide: getRepositoryToken(ContactInfo),
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(Address),
                    useValue: {}
                }
            ]
        }).compile();

        controller = module.get<AddressController>(AddressController);
        service = module.get<AddressService>(AddressService);
    });

    fit('should get addresses', () => {
        const address = new Address();
        address.address = 'CRA 17 # 15 - 22 - EDIFICIO 1';
        const addresses = ['CL 82 # 10 - 22 - barrio bonito']
        //jest.spyOn(service, 'getAddress').mockReturnValue(addresses);
        const headers = {
            cellphone: '3142411927'
        };
        const response = controller.getAddresses(headers);
        expect(response).toEqual(addresses);
    });

    it('should fail getting addresses', () => {
        expect(controller).toBeDefined();
    });

    it('should return 404 when getting addresses', () => {
        expect(controller).toBeDefined();
    });
});
