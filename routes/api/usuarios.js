const router = require('express').Router();
const transporter = require('../../config/email_config')
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { createToken, createTokenPassword } = require('../../helpers/utils');
const dayjs = require('dayjs');

const { response } = require('express');
const Actividad = require('../../models/usuario.model')
const Cliente = require('../../models/cliente.model')
const Terapeuta = require('../../models/terapeuta.model')

router.get('/', async (req, res) => {
    try {

        const usuarios = await Actividad.getAll();
        res.json(usuarios);
    } catch (error) {
        res.json({ error: error.message });
    }
});

// creamos la ruta api/usuarios/login para poder acceder 
router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    // comprobamos que el email coincide con uno existente en la BBDD
    const usuario = await Actividad.getByUsername(username);
    console.log(usuario);

    if (!usuario) {
        return res.json({ error: 'Error en usuario y/o contraseña (1)' })
    }

    // comprobamos que la contraseña coincide con la existente en BBDD
    const equals = bcrypt.compareSync(password, usuario.password);

    if (!equals) {
        return res.json({ error: 'Error en usuario y/o contraseña (2)' })
    }

    // si todo va correctamente, se le crea un token al usuario
    res.json({
        success: 'Login correcto',
        token: createToken(usuario),
        role: usuario.rol
    })
});

router.post('/sendEmailbookDate', async (req, res) => {

    const { emailPaciente } = req.body;
    const { id_terapeuta } = req.body;
    let terapeuta
    let cliente

    if (!emailPaciente || !id_terapeuta) {
        return res.status(400).send({ error: 'Se requiere un correo electrónico' });
    } else {
        terapeuta = await Terapeuta.getById(id_terapeuta)
        cliente = await Cliente.getByEmail(emailPaciente)
    }

    try {
        // Configura el correo electrónico
        const mailOptions1 = {
            from: '"Clínica Diverxia" <codediverxia@gmail.com>',
            to: emailPaciente,
            subject: 'Cita Reservada',
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
                            <h1>Estimado(a) ${cliente.nombre} ${cliente.apellidos},</h1>
                            <p>¡Gracias por reservar una cita en Clínica Diverxia! Nos complace confirmar los detalles de tu próxima cita:</p>
                            <p><strong>Terapeuta:</strong> ${terapeuta.nombre} ${terapeuta.apellidos}</p>
                            <p><strong>Terapia:</strong> ${terapeuta.nombre_terapia}</p>
                            <p><strong>Día:</strong> ${dayjs(req.body.dia).format('DD-MM-YYYY')}</p>
                            <p><strong>Hora:</strong> ${req.body.hora}</p>
                            <p>Si necesitas cambiar o cancelar tu cita, por favor, comunícate con nuestra clínica al menos 24 horas antes de la cita programada.</p>
                        </div>
                    </div>
                </body>
                </html>
                `,
        };

        const mailOptions2 = {
            from: '"Clínica Diverxia" <codediverxia@gmail.com>',
            to: terapeuta.email,
            subject: 'Reserva de Cita',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nueva Cita Reservada - Clínica Diverxia</title>
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
                            <h1>Estimado(a) ${terapeuta.nombre} ${terapeuta.apellidos},</h1>
                            <p>Se ha reservado una nueva cita contigo en Clínica Diverxia. A continuación, te proporcionamos los detalles de la cita:</p>
                            <p><strong>Terapia:</strong> ${terapeuta.nombre_terapia}</p>
                            <p><strong>Cliente:</strong> ${cliente.nombre} ${cliente.apellidos}</p>
                            <p><strong>Día:</strong> ${dayjs(req.body.dia).format('DD-MM-YYYY')}</p>
                            <p><strong>Hora:</strong> ${req.body.hora}</p>
                            <p>Por favor, asegúrate de estar disponible en el horario programado y de estar al tanto de los detalles del cliente para proporcionar la mejor atención posible.</p>
                        </div>
                    </div>
                </body>
                </html>

                `,
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions1);
        await transporter.sendMail(mailOptions2);
        res.status(200).send({ message: 'Correos de reserva de cita enviados.' });
    } catch (error) {
        console.error('Error al enviar correo de reserva de cita:', error);
        res.status(500).send({ error: 'No se pudo enviar el correo de reserva de cita' });
    }
});

router.post('/resetPassword', async (req, res) => {

    const { email } = req.body;
    let user

    if (!email) {
        return res.status(400).send({ error: 'Se requiere un correo electrónico' });
    } else {
        const terapeuta = await Terapeuta.getByEmail(email)
        if (terapeuta) {
            user = terapeuta
        }
        const cliente = await Cliente.getByEmail(email)
        if (cliente) {
            user = cliente
        }
    }

    console.log(user)

    const token = createTokenPassword(user)

    try {
        // Genera el enlace de restablecimiento de contraseña aquí (reemplázalo con tu lógica de enlace)
        const resetLink = `http://localhost:4200/change-password?token=${token}`;

        // Configura el correo electrónico
        const mailOptions = {
            from: '"Clínica Diverxia" <codediverxia@gmail.com>',
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Para restablecer tu contraseña, por favor visita el siguiente enlace: ${resetLink}`,
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #f7f7f7;
                        border-radius: 5px;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        font-size: 24px;
                        color: #4a4a4a;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 16px;
                        color: #4a4a4a;
                        line-height: 1.5;
                    }
                    .button {
                        display: inline-block;
                        background-color: #3498db;
                        color: white;
                        font-size: 16px;
                        text-decoration: none;
                        border-radius: 5px;
                        padding: 10px 20px;
                        margin-top: 20px;
                    }
                    .footer {
                        font-size: 14px;
                        text-align: center;
                        color: #4a4a4a;
                        margin-top: 30px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        Restablecer contraseña
                    </div>
                    <div class="message">
                        Hola,
                        <br><br>
                        Hemos recibido una solicitud para restablecer tu contraseña. Si no has realizado esta solicitud, puedes ignorar este correo electrónico.
                        <br><br>
                        Para restablecer tu contraseña, haz clic en el siguiente enlace:
                        <br><br>
                        <a href="${resetLink}" class="button">Restablecer contraseña</a>
                    </div>
                    <div class="footer">
                        Saludos,
                        <br>
                        Clínica Diverxia
                    </div>
                    </div>
                </body>
                </html>
                `,
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Correo de restablecimiento de contraseña enviado.' });
    } catch (error) {
        console.error('Error al enviar correo de restablecimiento de contraseña:', error);
        res.status(500).send({ error: 'No se pudo enviar el correo de restablecimiento de contraseña' });
    }
});

router.put('/updatePassword', async (req, res) => {

    // const { id_usuario, newPassword } = req.body;

    try {
        req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 11)

        console.log(req.body)

        // Guardamos el nuevo usuario en la base de datos
        const result = await Actividad.updatePassword(req.body)

        res.json(result)
    } catch (error) {
        res.json({ error: error.message })
    }
});

// creamos la ruta api/usuarios/register para poder registrar usuario
router.post('/register',

    body('username')
        .exists()
        .withMessage('El username es obligatorio')

    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(errors.array());
        }


        try {

            req.body.password = bcrypt.hashSync(req.body.password, 12);
            const user = await Cliente.createClientUser(req.body);
            const { insertId } = user;
            const result = await Cliente.createClient(req.body, user.insertId);
            const usuario = await Actividad.getById(insertId);
            res.json(usuario);
        } catch (error) {
            res.json({ error: error.message })
        }

    });

module.exports = router