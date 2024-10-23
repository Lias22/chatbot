const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
//const MongoAdapter = require('@bot-whatsapp/database/mongo')

const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")

// Definir el flow principal
const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola bienvenido NewReset!')
    .addAnswer([
        'Te comparto los siguientes links de interés sobre el proyecto:',
        '👉 *Menu* para ver el menu',
        '👉 *Stock* para ver la lista de Stock disponible',
        '👉 *web* para ver la web'
    ]);


    const flowCatalogo = addKeyword(EVENTS.ACTION)
        .addAnswer("Este es el Catalogo", {
            delay: 100,
            media:"https://celularesecuador.com/website/wp-content/uploads/2021/03/CATALOGO-DE-CELULARES-12-MARZO.pdf"
         })
    
    

    const flowHorario = addKeyword(EVENTS.ACTION)
        .addAnswer('El horario de atencion es de Lunes a Viernes de 08:00 - 18:00, Si queres agendar una cita hace click en el siguiente link: 👉www.agendatucita.com👈')
    
    


    const flowConsultas = addKeyword(EVENTS.ACTION)
        .addAnswer("Espere y a la brevedad sera atendido por uno de nuestros asesores!")

        








const flowWeb = addKeyword('Web', 'web')
    .addAnswer("Hace click en el siguiente enlace 👉www.NewReset.com👈")



// Definir el flow de bienvenida
const flowWelcome = addKeyword('stock')
    .addAnswer("stock", {
         delay: 100,
         media:"https://cdn-icons-png.flaticon.com/512/2338/2338582.png"
      });

// Menú principal con opciones y manejo de entradas inválidas
const menuFlow = addKeyword(["Menu", "menu"])
    .addAnswer(
        menu,
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic }) => {
            // Manejo de respuestas válidas
            if (["1", "2", "3"].includes(ctx.body)) {
                switch (ctx.body) {
                    case "1":
                        return gotoFlow(flowCatalogo);
                    case "2":
                        return gotoFlow(flowHorario);
                    case "3":
                        return gotoFlow(flowConsultas);
                }
            } else {
                // Comportamiento de fallback cuando la opción no es válida
                return await flowDynamic("❌ Opción no válida. Por favor selecciona una de las opciones del menú."

                    );
            }
        }
    );

// Función principal que inicializa el bot
const main = async () => {
    const adapterDB = new MockAdapter(
    );
    const adapterFlow = createFlow([flowPrincipal, flowWelcome, menuFlow, flowCatalogo, flowHorario, flowConsultas, flowWeb  ]); // Flujos principales
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
