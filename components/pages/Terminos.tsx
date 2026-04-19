
import React from 'react';
import { useSEO } from '../../hooks/useSEO.ts';

const Terminos: React.FC = () => {
    useSEO({
        title: 'Hungers | Términos de Servicio',
        description: 'Consulta los términos y condiciones de uso de la plataforma Hungers.',
    });

    return (
        <div className="bg-white min-h-screen">
            {/* Header decorativo */}
            <div className="bg-green-50 py-16 border-b border-green-100">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-green-900 uppercase tracking-tighter">Términos de Servicio</h1>
                    <p className="text-green-700 mt-4 font-medium uppercase tracking-widest text-xs">Última actualización: Febrero 2024</p>
                </div>
            </div>

            {/* Contenido Legal */}
            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="prose prose-green prose-lg max-w-none text-green-800 leading-relaxed space-y-8 font-['Roboto']">
                    
                    <p className="font-medium text-lg">
                        Hungers ("Hungers", "nosotros", "nos", "nuestro") le proporciona sus servicios (descritos a continuación) a través de su sitio web ubicado en <a href="https://www.hungers.com.co" className="text-green-600 font-bold hover:underline">https://www.hungers.com.co</a> (el "Sitio") y servicios relacionados (colectivamente, dichos servicios, incluidas las nuevas características, aplicaciones, y el Sitio, los "Servicios"), sujeto a los siguientes Términos de servicio (según se modifiquen de vez en cuando, los "Términos de Servicio").
                    </p>

                    <p>
                        Estos Términos de Servicio forman un acuerdo legalmente vinculante ("el Acuerdo") entre usted y Hungers, sus matrices, subsidiarias, representantes, afiliados, funcionarios y directores que rigen su uso del Servicio. Nos reservamos el derecho, a nuestra entera discreción, de cambiar o modificar partes de estos Términos de servicio en cualquier momento. Si hacemos esto, publicaremos los cambios en esta página e indicaremos en esta página la fecha en que estos términos fueron revisados por última vez. Nos esforzaremos por notificarle los cambios materiales en los Términos, ya sea a través de la interfaz de usuario de los Servicios, en una notificación por correo electrónico o a través de otros medios razonables. Dichos cambios entrarán en vigencia inmediatamente después de su aceptación del Acuerdo modificado. Su uso continuado del Servicio después de la fecha en que dichos cambios entren en vigencia constituye su aceptación de los nuevos Términos de Servicio.
                    </p>

                    <div className="bg-red-50 p-8 rounded-3xl border border-red-100 mb-10">
                        <p className="text-red-900 font-black uppercase text-sm mb-4 tracking-widest">Aviso Importante:</p>
                        <p className="text-red-800 text-sm leading-relaxed">
                            LEA ESTOS TÉRMINOS DE SERVICIO CUIDADOSAMENTE, YA QUE CONTIENEN UN ACUERDO DE ARBITRAJE Y OTRA INFORMACIÓN IMPORTANTE CON RESPECTO A SUS DERECHOS LEGALES, RECURSOS Y OBLIGACIONES. EL ACUERDO DE ARBITRAJE REQUIERE QUE USTED PRESENTE LAS RECLAMACIONES QUE TENGA CONTRA NOSOTROS A UN ARBITRAJE VINCULANTE Y FINAL.
                        </p>
                    </div>

                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tight pt-4">Acceso y Uso del Servicio</h2>
                    <p>
                        <strong>Descripción de los Servicios:</strong> El Servicio es una plataforma tecnológica que proporciona un mercado en línea que permite conexiones entre chefs, proveedores de catering y otras personas que desean enumerar, ofrecer, vender y entregar alimentos y pedidos de comidas ("Comida(s)") al público en general, y los clientes que navegan y compran Comidas. Los usuarios que compran Comidas a través del Servicio son "Cliente(s)", y los usuarios que enumeran, preparan y venden Comidas a través del Servicio son "Vendedor(es)".
                    </p>

                    <p>
                        Hungers ofrece una plataforma tecnológica y no es en sí mismo un Vendedor y no está preparando, empaquetando o vendiendo ningún alimento. El Servicio incluye permitir que los usuarios se conecten entre sí y con los servicios relacionados, pero no somos parte de ninguna transacción de compra o venta.
                    </p>

                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tight pt-4">Representaciones, Garantías y Acuerdos</h2>
                    <p>Todos los Usuarios declaran y garantizan que:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Tiene al menos la edad legalmente requerida en la jurisdicción en la que reside.</li>
                        <li>Utilizará su nombre real o nombre comercial en su perfil.</li>
                        <li>Al usar o acceder al Marketplace de Hungers, actuará de acuerdo con todas las leyes y regulaciones locales.</li>
                    </ul>

                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tight pt-4">Transacciones de compra y venta</h2>
                    <p>
                        <strong>Cargos:</strong> Registrarse en el Servicio es gratuito; sin embargo, Hungers cobra ciertas tarifas por diversas transacciones realizadas a través del Servicio, según lo establecido en la política de tarifas.
                    </p>
                    <p>
                        <strong>Responsabilidad del Cliente:</strong> Las comidas compradas y entregadas a los Clientes en Colombia, pueden estar sujetas al impuesto sobre las ventas IVA o Impuesto al Consumo. Los Clientes son responsables de pagar el precio de compra aplicable, costos de entrega e impuestos.
                    </p>

                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tight pt-4">Derechos de propiedad intelectual</h2>
                    <p>
                        Usted reconoce y acepta que el Servicio puede contener contenido o características protegidos por derechos de autor, patentes, marcas comerciales o secretos comerciales. El nombre y los logotipos de Hungers son marcas comerciales exclusivas de Hungers.
                    </p>

                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tight pt-4">Resolución de disputas</h2>
                    <p>
                        Las controversias surgidas entre las partes se resolverán en derecho por un Tribunal Arbitral administrado por el Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá.
                    </p>

                    <div className="pt-12 border-t border-gray-100 text-center">
                        <p className="text-green-600 font-bold">¿Preguntas sobre estos términos?</p>
                        <p className="text-sm">Escríbenos a: <a href="mailto:federico@hungers.com.co" className="font-black hover:underline">federico@hungers.com.co</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terminos;
