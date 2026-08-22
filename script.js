// ========================================
// CONFIGURACIÓN
// ========================================

// Pega aquí la URL de tu aplicación web
// de Google Apps Script.

const API_URL = "https://script.google.com/macros/s/AKfycbyDs8Ro5pbi34fRbQhMu9dUlhBGJwh0IxqojBBUNZ3aVKfWrseHSjFVypfbMnnj5-HBxA/exec";


// ========================================
// FORMULARIO DE CITAS
// ========================================

const appointmentForm = document.getElementById(
    "appointment-form"
);

const formMessage = document.getElementById(
    "form-message"
);

const submitButton = appointmentForm.querySelector(
    ".submit-button"
);


// ========================================
// ENVÍO DEL FORMULARIO
// ========================================

appointmentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // --------------------------------
        // Obtener datos
        // --------------------------------

        const formData = new FormData(
            appointmentForm
        );


        const datos = {

            paciente: formData.get("paciente"),

            telefono: formData.get("telefono"),

            servicio: formData.get("servicio"),

            fechaCita: formData.get("fechaCita"),

            hora: formData.get("hora"),

            observaciones:
                formData.get("observaciones") || ""

        };


        // --------------------------------
        // Estado visual
        // --------------------------------

        submitButton.disabled = true;

        submitButton.textContent =
            "Enviando solicitud...";

        formMessage.textContent = "";


        try {

            // --------------------------------
            // Enviar a Google Apps Script
            // --------------------------------

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(datos)
                }
            );


            const resultado =
                await response.json();


            // --------------------------------
            // Respuesta exitosa
            // --------------------------------

            if (resultado.success) {

                formMessage.textContent =
                    "✅ Solicitud enviada correctamente. " +
                    "Nos pondremos en contacto contigo " +
                    "para confirmar tu cita.";

                formMessage.style.color =
                    "#167c80";

                appointmentForm.reset();

            }

            // --------------------------------
            // Error enviado por Apps Script
            // --------------------------------

            else {

                throw new Error(
                    resultado.message ||
                    "No se pudo registrar la cita."
                );

            }


        } catch (error) {

            console.error(
                "Error:",
                error
            );


            formMessage.textContent =
                "❌ No pudimos enviar la solicitud. " +
                "Por favor, inténtalo nuevamente.";

            formMessage.style.color =
                "#c0392b";

        }


        // --------------------------------
        // Restaurar botón
        // --------------------------------

        submitButton.disabled = false;

        submitButton.textContent =
            "Solicitar cita";

    }
);
