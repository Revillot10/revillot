import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function CookiePolicy() {
  return (
    <>
      <Header />
      <div className="policy-page">
        <div className="policy-page__inner">
          <h1 className="policy-page__title">Política de Cookies</h1>

          <div className="policy-page__content">
            <p>
              Podemos recopilar información sobre tu ordenador, incluida tu dirección IP,
              sistema operativo y tipo de navegador, para la administración del sistema y
              para crear informes. Se trata de datos estadísticos sobre las acciones y
              patrones de navegación de nuestros usuarios, y no identifica a ninguna persona.
            </p>

            <p>
              Las únicas cookies en uso en nuestro sitio son las de Google Analytics.
              Google Analytics es una herramienta de análisis web que ayuda a los propietarios
              de sitios web a comprender cómo los visitantes interactúan con su sitio web.
              Los clientes de Google Analytics pueden ver una variedad de informes sobre cómo
              los visitantes interactúan con su sitio web para poder mejorarlo.
            </p>

            <p>
              Al igual que muchos servicios, Google Analytics utiliza cookies de origen para
              rastrear las interacciones de los visitantes. En nuestro caso, se utilizan para
              recopilar información sobre cómo los visitantes usan nuestro sitio. Luego usamos
              esa información para elaborar informes y mejorar nuestro sitio.
            </p>

            <p>
              Las cookies contienen información que se transfiere al disco duro de tu ordenador.
              Estas cookies se usan para almacenar información, como la hora en que ocurrió la
              visita actual, si el visitante ya ha estado en el sitio antes y qué sitio remitió
              al visitante a la página web.
            </p>

            <p>
              Google Analytics recopila información de forma anónima. Informa sobre las
              tendencias del sitio web sin identificar a los visitantes individuales. Puedes
              excluirte de Google Analytics sin que ello afecte a tu visita al sitio.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
