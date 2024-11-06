export function legalContractEmailTemplate(docData) {
    return `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                <table width="100%" style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr>
                            <td style="background-color: #9c5fd9; padding: 20px; text-align: center; color: #fff;">
                                <table width="100%" style="display: flex;  justify-content: space-around;">
                                    <tr>
                                        <td style="padding-right: 10px;">
                                            <img src="https://tasky.com.co/images/logo.png" alt="logo" width="120" height="40" style="vertical-align: middle;">
                                        </td>
                                        <td>
                                            <h1 style="margin: 0; font-size: 24px; color: #fff;">¡Hola, ${docData.firstname}!</h1>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 20px;">
                                <p style="font-size: 18px; line-height: 1.6; color: #555;">
                                    Nos complace informarte que tu contrato ha sido actualizado.
                                </p>
                                <div style="text-align: center; margin-top: 20px;">
                                    <!-- Botón de descarga o contenido adicional -->
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #777;">
                                © 2024 Tasky S.A.S. Todos los derechos reservados.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `;
}
