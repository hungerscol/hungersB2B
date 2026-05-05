import React from 'react';
import { useNavigate } from 'react-router-dom';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-lg font-black text-green-900 uppercase tracking-tighter mb-3">{title}</h2>
        <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
);

const Terminos: React.FC = () => {
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
                    <h1 className="text-4xl font-black text-green-900 uppercase tracking-tighter mb-2">Términos de Servicio</h1>
                    <p className="text-gray-400 text-sm">Hungers — hungers.com.co</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-10 text-sm text-yellow-800 font-medium leading-relaxed">
                    <strong>LEA ESTOS TÉRMINOS CUIDADOSAMENTE.</strong> Contienen un acuerdo de arbitraje y otra información importante con respecto a sus derechos legales, recursos y obligaciones. Al usar el Servicio, usted acepta estar sujeto a estos Términos.
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    Hungers ("Hungers", "nosotros", "nos", "nuestro") le proporciona sus servicios a través de su sitio web ubicado en <a href="https://www.hungers.com.co" className="text-green-700 font-bold hover:underline">https://www.hungers.com.co</a> (el "Sitio") y servicios relacionados (colectivamente, los "Servicios"), sujeto a los siguientes Términos de Servicio. Nos reservamos el derecho de cambiar o modificar estos Términos en cualquier momento. Su uso continuado del Servicio después de dichos cambios constituye su aceptación de los nuevos Términos.
                </p>

                <Section title="Acceso y Uso del Servicio">
                    <p><strong>Descripción de los Servicios:</strong> El Servicio es una plataforma tecnológica que proporciona un mercado en línea que permite conexiones entre chefs, proveedores de catering y otras personas que desean listar, ofrecer, vender y entregar alimentos ("Comidas") al público en general, y los clientes que las compran. Los usuarios que compran Comidas son "Clientes", y los que las venden son "Vendedores".</p>
                    <p>Hungers ofrece una plataforma tecnológica y no es en sí mismo un Vendedor. No cocina, empaqueta ni entrega alimentos. Cada Vendedor es el único responsable de cumplir con todas las leyes y regulaciones aplicables relacionadas con la preparación, venta, comercialización y empaque de las Comidas.</p>
                    <p><strong>Obligaciones de registro:</strong> Si elige registrarse, acepta proporcionar y mantener información verdadera, precisa, actual y completa. El Servicio está disponible solo para personas que pueden celebrar contratos legalmente vinculantes. No está disponible para menores de edad.</p>
                    <p><strong>Cuenta, contraseña y seguridad:</strong> Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta. Debe notificar inmediatamente a Hungers cualquier uso no autorizado.</p>
                    <p><strong>Modificaciones al Servicio:</strong> Hungers se reserva el derecho de modificar o interrumpir el Servicio con o sin previo aviso, sin responsabilidad ante usted.</p>
                </Section>

                <Section title="Condiciones de Uso">
                    <p>Usted es el único responsable de todo el contenido que cargue o transmita a través del Servicio. Acepta no utilizar el Servicio para actividades ilegales, dañinas, abusivas, obscenas, difamatorias o que infrinjan derechos de terceros. Tampoco puede hacerse pasar por otras personas, recolectar información de contacto de otros usuarios sin consentimiento, o interferir con el funcionamiento del Servicio.</p>
                </Section>

                <Section title="Representaciones y Garantías">
                    <p>Todos los usuarios declaran que tienen la edad legalmente requerida, tienen el derecho y la autoridad para celebrar este Acuerdo, han leído y aceptan estos Términos, y actuarán de acuerdo con todas las leyes y regulaciones aplicables.</p>
                    <p>Los vendedores adicionalmente declaran que operan como negocio independiente, tienen todos los permisos y licencias requeridos, son responsables de la calidad y seguridad de sus productos, y pagarán todos los impuestos aplicables.</p>
                </Section>

                <Section title="Transacciones de Compra y Venta">
                    <p><strong>Cargos:</strong> Registrarse en el Servicio es gratuito. Hungers cobra ciertas tarifas por transacciones según la Política de Tarifas en <a href="https://www.hungers.com.co/politica-de-tarifas" className="text-green-700 font-bold hover:underline">hungers.com.co/politica-de-tarifas</a>.</p>
                    <p><strong>Pagos:</strong> Los clientes pueden pagar con tarjetas de crédito u otros métodos aceptados. Los vendedores deben proporcionar datos bancarios para recibir pagos. Si disputa algún cargo, debe notificar a Hungers dentro de los 14 días posteriores.</p>
                    <p><strong>Promociones:</strong> Hungers puede ofrecer promociones y créditos según sus propios términos. Son personales e intransferibles salvo que se indique lo contrario.</p>
                </Section>

                <Section title="Derechos de Propiedad Intelectual">
                    <p>El Servicio y su contenido están protegidos por derechos de autor, patentes, marcas comerciales y otras leyes. No puede modificar, copiar, distribuir, vender ni crear trabajos derivados del Servicio sin autorización expresa de Hungers. El nombre y logotipos de Hungers son marcas registradas.</p>
                    <p>Al cargar contenido, usted otorga a Hungers una licencia no exclusiva, mundial, libre de regalías para usar, mostrar y distribuir dicho contenido en relación con la operación del Servicio.</p>
                </Section>

                <Section title="Quejas de Derechos de Autor (DMCA)">
                    <p>Si cree que su trabajo ha sido copiado de manera que constituye una infracción de derechos de autor, notifique a Hungers a <a href="mailto:federico@hungers.com.co" className="text-green-700 font-bold hover:underline">federico@hungers.com.co</a> (asunto: "Solicitud de eliminación DMCA") con: firma del titular, descripción del trabajo infringido, ubicación en el Servicio, sus datos de contacto, y declaración de buena fe.</p>
                </Section>

                <Section title="Indemnización">
                    <p>Usted acepta indemnizar y eximir de responsabilidad a Hungers y sus afiliados de todas las pérdidas, daños, gastos y reclamaciones que surjan de su uso del Servicio, su contenido, la violación de estos Términos o de los derechos de terceros.</p>
                </Section>

                <Section title="Descargo de Responsabilidad de Garantías">
                    <p>EL SERVICIO SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". HUNGERS RENUNCIA A TODAS LAS GARANTÍAS EXPRESAS O IMPLÍCITAS. NO GARANTIZA QUE EL SERVICIO SEA ININTERRUMPIDO, LIBRE DE ERRORES O QUE CUMPLA CON SUS EXPECTATIVAS.</p>
                </Section>

                <Section title="Limitación de Responsabilidad">
                    <p>HUNGERS NO SERÁ RESPONSABLE DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES O CONSECUENTES. EN NINGÚN CASO LA RESPONSABILIDAD TOTAL DE HUNGERS EXCEDERÁ LA CANTIDAD PAGADA POR USTED EN LOS ÚLTIMOS SEIS (6) MESES, O CIEN MIL PESOS ($100.000), LO QUE SEA MAYOR.</p>
                </Section>

                <Section title="Resolución de Disputas mediante Arbitraje Vinculante">
                    <p>Todas las disputas entre usted y Hungers se resolverán exclusivamente mediante arbitraje final y vinculante, no en tribunales, excepto para reclamaciones individuales en tribunales de menor cuantía. Tanto usted como Hungers renuncian al derecho a juicio por jurado o a participar en acciones colectivas.</p>
                    <p><strong>Procedimiento:</strong> Las controversias se resolverán por un Tribunal Arbitral administrado por el Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá.</p>
                    <p><strong>Resolución previa:</strong> Antes del arbitraje, las partes deben intentar resolver la disputa. Puede contactar a Hungers en <a href="mailto:federico@hungers.com.co" className="text-green-700 font-bold hover:underline">federico@hungers.com.co</a>. Si no hay resolución en 60 días, se puede iniciar el arbitraje.</p>
                    <p><strong>Confidencialidad:</strong> Todos los aspectos del procedimiento de arbitraje serán estrictamente confidenciales.</p>
                </Section>

                <Section title="Terminación">
                    <p>Hungers puede suspender o cancelar su cuenta por incumplimiento de estos Términos, falta de uso, o actividad fraudulenta o ilegal. Hungers también puede interrumpir el Servicio en cualquier momento con o sin previo aviso.</p>
                </Section>

                <Section title="General">
                    <p>Estos Términos constituyen el acuerdo completo entre usted y Hungers. Si alguna disposición es inválida, el resto permanece en vigor. Cualquier reclamo debe presentarse dentro de un (1) año desde que surge. Para más información sobre privacidad, consulte nuestra <a href="https://www.hungers.com.co/tratamiento-de-datos-personales" className="text-green-700 font-bold hover:underline">Política de Privacidad</a>.</p>
                    <p>Contacto: <a href="mailto:federico@hungers.com.co" className="text-green-700 font-bold hover:underline">federico@hungers.com.co</a> — Calle 119 No.14ª-41, Bogotá, Colombia.</p>
                </Section>
            </div>
        </div>
    );
};

export default Terminos;