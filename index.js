require('dotenv').config();

const { inquirerMenu, pausa, leerInput, listasLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(termino);

                // seeccionar los lugares 
                const id = await listasLugares(lugares);
                if (id === '0') continue;

                // seleccionar el lugar
                const lugarSeleccionado = lugares.find(lugar => lugar.id === id);

                // guarda en db
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // clima
                const climaLugar = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);

                console.log('Ciudad: ', lugarSeleccionado.nombre.green);
                console.log('Latitud: ', lugarSeleccionado.lat);
                console.log('Longiud: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', climaLugar.temp);
                console.log('Temperatura Mínima: ', climaLugar.tmin);
                console.log('Temperatura Máxima: ', climaLugar.tmax);
                console.log('Humedad: ', climaLugar.hume);
                console.log('Velocidad del viento: ', climaLugar.winv);
                console.log('Dirección del viento: ', climaLugar.wind);
                console.log('Presión barométrica: ', climaLugar.pres);
                console.log('Cómo está el clima: ', climaLugar.descripcion);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${ i + 1 }`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
                break;

        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();