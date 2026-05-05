import React from 'react';
import { useNavigate } from 'react-router-dom';

const Section: React.FC<{ num: string; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
    <div className="mb-8">
        <h2 className="text-lg font-black text-green-900 uppercase tracking-tighter mb-3">{num}. {title}</h2>
        <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
);

const PoliticaDatos: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-14 border border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="text-green-700 font-black text-xs uppercase tracking-widest hover:text-green-900 mb-8 flex items-center gap-2 transition-colors"
                >
                    ← Volver
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl font-black text-green-900 uppercase tracking-tighter mb-2">Política de Tratamiento de Datos</h1>
                    <p className="text-gray-400 text-sm">Hungers — hungers.com.co</p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    Esta Política de Privacidad explica qué información recogemos, cómo la utilizamos y compartimos esos datos, y sus opciones en relación con nuestras prácticas de datos. Antes de utilizar el Servicio, le rogamos que la revise detenidamente. Si tiene alguna pregunta, contáctenos en <a href="mailto:hola@hungers.com.co" className="text-green-700 font-bold hover:underline">hola@hungers.com.co</a>. Al utilizar el Servicio, usted acepta las prácticas descritas en esta Política.
                </p>

                <Section num="1" title="Información que recopilamos">
                    <p><strong>Información que usted proporciona:</strong> Recopilamos la información que nos proporciona al registrarse, actualizar su perfil, contactarnos, realizar compras, participar en promociones o solicitar empleo. Esto incluye nombre, correo electrónico, teléfono, dirección de entrega, datos demográficos, credenciales de cuenta e información financiera para el procesamiento de pagos.</p>
                    <p><strong>Redes sociales y chatbots:</strong> Cuando interactúa con nuestras páginas en Instagram, Facebook, Twitter o LinkedIn, recopilamos la información que nos proporciona. Si menciona a Hungers públicamente, podemos usar esa referencia en nuestro Servicio.</p>
                    <p><strong>Información automática:</strong> Cuando visita el Servicio recopilamos datos de registro (IP, tipo de navegador, fecha y hora), información del dispositivo (nombre, sistema operativo, idioma) e información de uso (contenido que ve, acciones que realiza, frecuencia y duración de actividades).</p>
                    <p><strong>Cookies y píxeles:</strong> Utilizamos cookies para operar el Sitio, recopilar datos de uso, ofrecer publicidad y mejorar su experiencia. También usamos píxeles (balizas web) en combinación con cookies para rastrear actividad y medir conversiones, incluyendo píxeles de Facebook y otros socios publicitarios.</p>
                    <p><strong>Análisis:</strong> Utilizamos Google Analytics y otros servicios de análisis para analizar el uso del Sitio. Para más información: <a href="https://www.google.com/policies/privacy/partners/" className="text-green-700 hover:underline">google.com/policies/privacy/partners</a>.</p>
                    <p><strong>Vendedores:</strong> Si se registra como Vendedor, recopilamos adicionalmente número de registro sanitario, documento de identidad emitido por el gobierno (cédula de ciudadanía) e información financiera para facilitar pagos.</p>
                </Section>

                <Section num="2" title="Cómo utilizamos la información">
                    <p>Utilizamos la información recopilada para:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Proporcionar y operar el Servicio y el marketplace</li>
                        <li>Responder a sus consultas y solicitudes</li>
                        <li>Facilitar sus pedidos y transacciones</li>
                        <li>Enviar comunicaciones administrativas y de servicio</li>
                        <li>Analizar y mejorar el Servicio</li>
                        <li>Desarrollar nuevos productos y servicios</li>
                        <li>Prevenir fraudes y garantizar la seguridad</li>
                        <li>Llevar a cabo promociones</li>
                        <li>Cumplir con obligaciones legales</li>
                        <li>Enviarle comunicaciones de marketing (con su consentimiento)</li>
                    </ul>
                    <p>Puede optar por no recibir correos promocionales siguiendo las instrucciones en cada email, respondiendo "STOP" a mensajes de texto, o contactándonos en <a href="mailto:hola@hungers.com.co" className="text-green-700 font-bold hover:underline">hola@hungers.com.co</a>.</p>
                </Section>

                <Section num="3" title="Intercambio y divulgación de información">
                    <p>Compartimos su información con:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Proveedores de servicios:</strong> Hosting, procesadores de pago, análisis web, servicios de email y CRM.</li>
                        <li><strong>Vendedores:</strong> Para facilitar sus pedidos y comunicaciones.</li>
                        <li><strong>Socios publicitarios:</strong> Para análisis, publicidad dirigida y marketing.</li>
                        <li><strong>Otros usuarios:</strong> En casos necesarios para completar una entrega (dirección, teléfono).</li>
                        <li><strong>Transferencias de negocio:</strong> En caso de fusión, adquisición o venta de activos.</li>
                        <li><strong>Requisitos legales:</strong> Cuando la ley lo exija o para proteger derechos y seguridad.</li>
                        <li><strong>Afiliados:</strong> Entidades bajo control común con Hungers.</li>
                    </ul>
                </Section>

                <Section num="4" title="Sus derechos y opciones">
                    <p>Puede controlar las cookies desde la configuración de su navegador. Tenga en cuenta que desactivar cookies puede afectar la funcionalidad del Sitio.</p>
                    <p>Para excluirse de publicidad dirigida visite <a href="https://www.networkadvertising.org" className="text-green-700 hover:underline">networkadvertising.org</a> o <a href="https://www.aboutads.info/choices" className="text-green-700 hover:underline">aboutads.info/choices</a>.</p>
                    <p>Para optar por no participar en Matched Ads, contáctenos en <a href="mailto:hola@hungers.com.co" className="text-green-700 font-bold hover:underline">hola@hungers.com.co</a>.</p>
                    <p>En dispositivos móviles puede desactivar el seguimiento desde Ajustes → Privacidad → Seguimiento (iOS) o "Exclusión de anuncios basados en intereses" (Android).</p>
                </Section>

                <Section num="5" title="Conservación y supresión de datos">
                    <p>Conservamos la información durante el tiempo que sea razonablemente necesario para los fines descritos, mientras tengamos una necesidad comercial, o según lo exija la ley. Puede solicitar la eliminación de su información enviando un correo a <a href="mailto:federico@hungers.com.co" className="text-green-700 font-bold hover:underline">federico@hungers.com.co</a>.</p>
                </Section>

                <Section num="6" title="Actualice su información">
                    <p>Acceda a su cuenta o contáctenos en <a href="mailto:federico@hungers.com.co" className="text-green-700 font-bold hover:underline">federico@hungers.com.co</a> si necesita cambiar, eliminar o corregir su información.</p>
                </Section>

                <Section num="7" title="Niños">
                    <p>Nuestro Servicio no está dirigido a niños. No recopilamos a sabiendas información personal de menores de conformidad con el artículo 7 de la Ley 1581 de 2012. Si usted es padre o tutor y cree que su hijo ha proporcionado información, contáctenos en <a href="mailto:hola@hungers.com.co" className="text-green-700 font-bold hover:underline">hola@hungers.com.co</a>.</p>
                </Section>

                <Section num="8" title="Enlaces a otros sitios web">
                    <p>El Servicio puede contener enlaces a otros sitios no operados por Hungers. La información que comparta con esas partes se regirá por sus propias políticas de privacidad. No respaldamos ni somos responsables de esos sitios.</p>
                </Section>

                <Section num="9" title="Seguridad">
                    <p>Implementamos medidas técnicas, administrativas y organizativas comercialmente razonables para proteger su información. Sin embargo, ninguna transmisión por Internet es totalmente segura. Tenga cuidado al decidir qué información nos comparte a través del Servicio o correo electrónico.</p>
                </Section>

                <Section num="10" title="Cambios en la política de privacidad">
                    <p>Podemos actualizar esta política en cualquier momento. Publicaremos la versión actualizada en esta página. Al continuar usando el Servicio después de los cambios, acepta la política actualizada.</p>
                </Section>

                <Section num="11" title="Contacto">
                    <p>Si tiene preguntas sobre nuestra Política de Privacidad, contáctenos en <a href="mailto:hola@hungers.com.co" className="text-green-700 font-bold hover:underline">hola@hungers.com.co</a>. Esta política ha sido diseñada para ser accesible. Si tiene dificultades para acceder a la información, contáctenos en el mismo correo.</p>
                </Section>
            </div>
        </div>
    );
};

export default PoliticaDatos;
