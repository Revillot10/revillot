import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="policy-page">
        <div className="policy-page__inner">
          <h1 className="policy-page__title">Política de Privacidad</h1>

          <div className="policy-page__content">
            <h2>Quiénes somos</h2>
            <p>
              Este aviso de privacidad te informa qué puedes esperar cuando Revillot Garage
              recopila información personal a través de nuestro sitio web.
              Domicilio registrado: Curicó, Región del Maule, Chile.
            </p>

            <h2>Cómo recopilamos datos</h2>

            <h3>Formularios del sitio web</h3>
            <p>
              Puedes proporcionarnos información a través de los formularios de nuestro sitio web.
              Esta información puede incluir tu:
            </p>
            <ul>
              <li>Nombre</li>
              <li>Dirección</li>
              <li>Número de teléfono</li>
              <li>Correo electrónico</li>
              <li>Información proporcionada en el campo de consulta</li>
            </ul>

            <h3>Google Analytics</h3>
            <p>
              Cuando alguien visita nuestro sitio web, utilizamos Google Analytics, un servicio
              de terceros, para recopilar información estándar de registro de internet y detalles
              sobre los patrones de comportamiento de los visitantes. Lo hacemos para conocer
              datos como el número de visitantes en las distintas partes del sitio.
            </p>
            <p>
              Esta información se procesa de forma que no identifica a ninguna persona.
            </p>

            <h2>Qué hacemos con esos datos</h2>
            <p>
              Utilizaremos la información que proporciones a través de nuestros formularios para
              responder a tu consulta. Si nos lo has solicitado, te añadiremos a nuestra lista
              de correo.
            </p>

            <h2>Con quién lo compartimos</h2>
            <p>
              Utilizamos Google Analytics para recopilar información estándar de registro de
              internet y detalles sobre los patrones de comportamiento de los visitantes. Esta
              información se procesa de forma que no identifica a ninguna persona.
            </p>
            <p>
              La información proporcionada a través de los formularios de nuestro sitio web
              no se comparte con terceros. Si necesitamos compartir tu información con terceros
              para tramitar tu consulta, te informaremos antes de hacerlo.
            </p>

            <h2>Acceso a información personal</h2>
            <p>
              Puedes solicitarnos cualquier información personal que tengamos sobre ti. Para
              cualquier consulta relacionada con la protección de datos, puedes contactarnos por:
            </p>

            <h3>Correo postal</h3>
            <p>
              Revillot Garage<br />
              Curicó, Región del Maule<br />
              Chile
            </p>

            <h3>Correo electrónico</h3>
            <p>
              Utiliza el formulario de consulta en nuestra{' '}
              <a href="/contact">página de contacto</a> para escribirnos.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
