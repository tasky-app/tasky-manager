export abstract class SmsTemplates {
    public static Messages = {
        "contract_created": (name?: string) => '¡Tienes una nueva solicitud de servicio en Tasky 🐙! Abre la app para conocer los detalles.',
        "finish_procedure_registration": (name?: string) =>
            name
                ? `Hola ${name}, estas a punto de finalizar tu proceso de registro en Tasky 🐙, ingresa a la APP para finalizarlo!`
                : 'Estas a punto de finalizar tu proceso de registro en Tasky 🐙, ingresa a la APP para finalizarlo!',
    };
}
