const router = require('express').Router();
const transporter = require('../../config/email_config')

const { response } = require('express');
const Actividad = require('../../models/cita.model')
const Terapeuta = require('../../models/terapeuta.model')
const Cliente = require('../../models/cliente.model')
const Cita = require('../../models/cita.model')
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin timezone correctamente
dayjs.extend(timezone);
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

router.get('/', async (req, res) => {

    try {
        const citas = await Actividad.getAll()
        res.json(citas)

    } catch (err) {
        res.json({ error: err.message })
    }

});


router.get('/terapeuta/:idTerapeuta', async (req, res) => {

    const { idTerapeuta } = req.params;
    const terapeuta = await Terapeuta.getTerapeutaYTerapiaPorId(idTerapeuta)
    const esPsicologo = terapeuta.nombre_terapia === "Psicología"

    try {

        let citas
        if (esPsicologo) {
            citas = await Actividad.getByTerapeuta60(idTerapeuta);
        } else {
            citas = await Actividad.getByTerapeuta45(idTerapeuta);
        }
        // const citas = await Actividad.getByTerapeuta(idTerapeuta);

        const citasProcesadas = citas.map((row) => {
            const dia = dayjs(row.dia);
            console.log('dia', dia)
            const diaStr = dia.format('YYYY-MM-DD'); // Crear una nueva variable para almacenar la fecha en formato de cadena
            const esVerano = dia.isBetween(
                dayjs(`${dia.year()}-06-01`),
                dayjs(`${dia.year()}-09-30`),
                null,
                "[]"
            );

            const esSabado = dia.day() === 6;

            const hora = esSabado
                ? row.hora_sabado_invierno
                : esVerano
                    ? row.hora_inicio_verano
                    : row.hora_inicio_invierno;

            let hora_final

            if (row.nombre_terapia === 'Psicología') {
                hora_final = dayjs(hora, 'HH:mm:ss').add(60, 'minute').format('HH:mm:ss');
            } else {
                hora_final = dayjs(hora, 'HH:mm:ss').add(45, 'minute').format('HH:mm:ss');
            }

            return {
                id: row.id,
                dia: diaStr, // Utilizar la variable 'diaStr' en lugar de 'dia'
                id_terapeuta: row.id_terapeuta,
                id_usuario: row.id_usuario,
                nombre: row.nombre,
                nombre_terapia: row.nombre_terapia,
                terapeuta_nombre: row.terapeuta_nombre,
                terapeuta_apellidos: row.terapeuta_apellidos,
                terapeuta_email: row.terapeuta_email,
                apellidos: row.apellidos,
                hora_inicio: hora,
                hora_final: hora_final
            };
        });

        res.json(citasProcesadas);
    } catch (err) {
        res.json({ error: err.message });
    }
});

router.get('/cliente/:idCliente', async (req, res) => {

    const { idCliente } = req.params;

    try {

        const citas = await Actividad.getByCliente(idCliente);

        const citasProcesadas = citas.map((row) => {
            const dia = dayjs(row.dia);
            const diaStr = dia.format('YYYY-MM-DD'); // Crear una nueva variable para almacenar la fecha en formato de cadena
            const esVerano = dia.isBetween(
                dayjs(`${dia.year()}-06-01`),
                dayjs(`${dia.year()}-09-30`),
                null,
                "[]"
            );

            const esSabado = dia.day() === 6;
            let hora

            if (row.nombre_terapia === 'Psicología') {
                hora = esSabado
                    ? row.hora_sabado_invierno_60
                    : esVerano
                        ? row.hora_inicio_verano_60
                        : row.hora_inicio_invierno_60;
            } else {
                hora = esSabado
                    ? row.hora_sabado_invierno
                    : esVerano
                        ? row.hora_inicio_verano
                        : row.hora_inicio_invierno;
            }

            let hora_final

            if (row.nombre_terapia === 'Psicología') {
                hora_final = dayjs(hora, 'HH:mm:ss').add(60, 'minute').format('HH:mm:ss');
            } else {
                hora_final = dayjs(hora, 'HH:mm:ss').add(45, 'minute').format('HH:mm:ss');
            }

            return {
                id: row.id,
                dia: diaStr, // Utilizar la variable 'diaStr' en lugar de 'dia'
                id_terapeuta: row.id_terapeuta,
                id_usuario: row.id_usuario,
                nombre: row.nombre,
                nombre_terapia: row.nombre_terapia,
                terapeuta_nombre: row.terapeuta_nombre,
                terapeuta_apellidos: row.terapeuta_apellidos,
                terapeuta_email: row.terapeuta_email,
                apellidos: row.apellidos,
                hora_inicio: hora,
                hora_final: hora_final
            };
        });

        res.json(citasProcesadas);
    } catch (err) {
        res.json({ error: err.message });
    }
});


router.post('/create', async (req, res) => {

    try {
        const result = await Actividad.createDate(req.body);
        console.log(result);
        const { insertId } = result;
        const cita = await Actividad.getById(insertId)
        res.json(cita)

    } catch (error) {
        res.json({ error: error.message })
    }
});

router.delete('/deleteEmail/:idDate', async (req, res) => {

    try {
        const { idDate } = req.params;
        console.log(idDate);
        const infoCitaObjeto = await Cita.getById(idDate)
        console.log(infoCitaObjeto)
        const emails = await Cliente.getEmailsNotInIdDate(idDate)
        console.log(emails)

        const dia = dayjs(infoCitaObjeto.dia);
        const diaStr = dia.format('YYYY-MM-DD'); // Crear una nueva variable para almacenar la fecha en formato de cadena
        const esVerano = dia.isBetween(
            dayjs(`${dia.year()}-06-01`),
            dayjs(`${dia.year()}-09-30`),
            null,
            "[]"
        );

        const esSabado = dia.day() === 6;
        let hora

        if (infoCitaObjeto.nombre_terapia === 'Psicología') {
            hora = esSabado
                ? infoCitaObjeto.hora_sabado_invierno_60
                : esVerano
                    ? infoCitaObjeto.hora_inicio_verano_60
                    : infoCitaObjeto.hora_inicio_invierno_60;
        } else {
            hora = esSabado
                ? infoCitaObjeto.hora_sabado_invierno
                : esVerano
                    ? infoCitaObjeto.hora_inicio_verano
                    : infoCitaObjeto.hora_inicio_invierno;
        }

        let hora_final

        if (infoCitaObjeto.nombre_terapia === 'Psicología') {
            hora_final = dayjs(hora, 'HH:mm:ss').add(60, 'minute').format('HH:mm:ss');
        } else {
            hora_final = dayjs(hora, 'HH:mm:ss').add(45, 'minute').format('HH:mm:ss');
        }

        const infoCita = {
            id: infoCitaObjeto.id,
            dia: diaStr, // Utilizar la variable 'diaStr' en lugar de 'dia'
            id_terapeuta: infoCitaObjeto.id_terapeuta,
            id_usuario: infoCitaObjeto.id_usuario,
            nombre: infoCitaObjeto.nombre,
            email_cliente: infoCitaObjeto.email,
            nombre_terapia: infoCitaObjeto.nombre_terapia,
            terapeuta_nombre: infoCitaObjeto.terapeuta_nombre,
            terapeuta_apellidos: infoCitaObjeto.terapeuta_apellidos,
            terapeuta_email: infoCitaObjeto.terapeuta_email,
            apellidos: infoCitaObjeto.apellidos,
            hora_inicio: hora,
            hora_final: hora_final
        };

        const mailOptions1 = {
            from: '"Clínica Diverxia" <codediverxia@gmail.com>',
            to: infoCita.email_cliente,
            subject: 'Cita Cancelada',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Reserva de Cita - Clínica Diverxia</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                        }

                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                        }

                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .content {
                            background-color: #f7f7f7;
                            padding: 20px;
                            border-radius: 10px;
                        }

                        .cta {
                            display: inline-block;
                            background-color: #1a73e8;
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            Clínica Diverxia
                        </div>
                        <div class="content">
                            <h1>Estimado(a) ${infoCita.nombre} ${infoCita.apellidos},</h1>
                            <p>Te informamos que has cancelado una cita en Clínica Diverxia.</p>
                            <p><strong>Terapeuta:</strong> ${infoCita.terapeuta_nombre} ${infoCita.terapeuta_apellidos}</p>
                            <p><strong>Terapia:</strong> ${infoCita.nombre_terapia}</p>
                            <p><strong>Día:</strong> ${dayjs(infoCita.dia).format('DD-MM-YYYY')}</p>
                            <p><strong>Hora:</strong> ${infoCita.hora_inicio}</p>
                            <p>Si deseas reprogramar tu cita, por favor, comunícate con nuestra clínica para programar una nueva cita.</p>
                        </div>
                    </div>
                </body>
                </html>
                `,
        };

        const mailOptions2 = {
            from: '"Clínica Diverxia" <codediverxia@gmail.com>',
            to: infoCita.terapeuta_email,
            subject: 'Cita Cancelada',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Reserva de Cita - Clínica Diverxia</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                        }

                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                        }

                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .content {
                            background-color: #f7f7f7;
                            padding: 20px;
                            border-radius: 10px;
                        }

                        .cta {
                            display: inline-block;
                            background-color: #1a73e8;
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            Clínica Diverxia
                        </div>
                        <div class="content">
                            <h1>Estimado(a) ${infoCita.terapeuta_nombre} ${infoCita.terapeuta_apellidos},</h1>
                            <p>Te informamos que un cliente ha cancelado su cita en Clínica Diverxia. Los detalles de la cita son los siguientes:</p>
                            <p><strong>Cliente:</strong> ${infoCita.nombre} ${infoCita.apellidos}</p>
                            <p><strong>Terapia:</strong> ${infoCita.nombre_terapia}</p>
                            <p><strong>Día:</strong> ${dayjs(infoCita.dia).format('DD-MM-YYYY')}</p>
                            <p><strong>Hora:</strong> ${infoCita.hora_inicio}</p>
                            <p>Por favor, asegúrate de actualizar tu calendario y reprogramar cualquier cita futura que pudiera ser necesario. Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.</p>
                        </div>
                    </div>
                </body>
                </html>
                `,
        };

        const mailOptionsTemplate = {
            from: '"Clínica Diverxia" <codediverxia@gmail.com>',
            subject: 'Notificación de cancelación de cita',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Reserva de Cita - Clínica Diverxia</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                        }

                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                        }

                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .content {
                            background-color: #f7f7f7;
                            padding: 20px;
                            border-radius: 10px;
                        }

                        .cta {
                            display: inline-block;
                            background-color: #1a73e8;
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            Clínica Diverxia
                        </div>
                        <div class="content">
                            <h1>Estimado(a) cliente,</h1>
                            <p>Te informamos que un usuario ha cancelado una cita en Clínica Diverxia, y ahora hay un espacio disponible:</p>
                            <p><strong>Terapeuta:</strong> ${infoCita.terapeuta_nombre} ${infoCita.terapeuta_apellidos}</p>
                            <p><strong>Terapia:</strong> ${infoCita.nombre_terapia}</p>
                            <p><strong>Día:</strong> ${dayjs(infoCita.dia).format('DD-MM-YYYY')}</p>
                            <p><strong>Hora:</strong> ${infoCita.hora_inicio}</p>
                            <p>Si estás interesado en reservar esta cita, por favor visita nuestra página web para solicitarla. Si prefieres, también puedes ponerte en contacto con nuestra clínica para obtener más información o para programar una nueva cita.</p>
                        </div>
                    </div>
                </body>
                </html>
                `,
        };

        async function sendMailToAll(emails, mailOptionsTemplate) {
            for (const emailObj of emails) {
                const mailOptions3 = {
                    ...mailOptionsTemplate,
                    to: emailObj.email
                };
                await transporter.sendMail(mailOptions3);
            }
        }

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions1);
        await transporter.sendMail(mailOptions2);

        // Envía correos a todos los clientes en la lista de emails
        await sendMailToAll(emails, mailOptionsTemplate);

        console.log('Email enviados correctamente')

        res.json({ success: 'Email enviados correctamente' });
        // res.json(infoCita)

    } catch (error) {
        res.json({ error: error.message })
    }

});


router.delete('/deleteDate/:idDate', async (req, res) => {
    try {
        const { idDate } = req.params;
        console.log(idDate);

        const result = await Actividad.deleteById(idDate);
        console.log(result);
        res.json({ success: 'Cita borrada correctamente' });
        // res.json(infoCita)

    } catch (error) {
        res.json({ error: error.message })
    }
});


module.exports = router