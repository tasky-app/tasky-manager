import { Injectable } from '@nestjs/common';

@Injectable()
export class AvailabilityService {
    getAvailability() {
        // Implementación de lógica para obtener disponibilidad
        return { available: true, message: 'Disponibilidad obtenida correctamente' };
    }
}
