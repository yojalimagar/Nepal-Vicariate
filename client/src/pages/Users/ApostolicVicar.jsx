import React from 'react';
import Footer from '../../components/Footer';
import UpperHeader from '../../components/UpperHeader';
import LowerHeader from '../../components/LowerHeader';

const ApostolicVicar = () => {
  const currentVicar = {
    name: 'Rt. Rev. Paul Simick',
    title: 'Apostolic Vicar of Nepal',
    appointed: '13 April 2014',
    image: 'https://nazareth.org/wp-content/uploads/2014/07/tumblr_n8ph8b6mhK1qa8wqio1_500.jpg',
    bio: 'Rt. Rev. Paul Simick has served as the Apostolic Vicar of Nepal since 2014, leading the Catholic community with dedication to spiritual growth and community service.',
    email: 'paul.simick@vicariate.nepal',
    phone: '+977 1-1234567',
    officeHours: 'Mon-Fri, 10 AM - 2 PM',
  };

  const currentNuncio = {
    name: 'Archbishop George Jacob',
    title: 'Apostolic Nuncio to Nepal',
    appointed: '8 September 2022',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Card._George_J._Koovakad.jpg/500px-Card._George_J._Koovakad.jpg',
    bio: 'Archbishop George Jacob serves as the Apostolic Nuncio to Nepal, representing the Holy See and fostering diplomatic relations since 2022.',
    email: 'george.jacob@nunciature.nepal',
    phone: '+977 1-7654321',
    officeHours: 'Tue-Thu, 9 AM - 1 PM',
  };

  const formerVicars = [
    {
      name: 'Rt. Rev. Anthony Sharma, S.J.',
      years: '1996–2014',
      image: 'https://gesuiti.it/wp-content/uploads/2012/05/Anthony-Sharma.jpg',
    },
    {
      name: 'Fr. Thomas Wirth, S.J.',
      years: '1985–1996 (Prefect Apostolic)',
      image: 'https://via.placeholder.com/150x150?text=Fr.+Thomas+Wirth',
    },
  ];

  const formerNuncios = [
    {
      name: 'Archbishop Salvatore Pennacchio',
      years: '2010–2016',
      image: 'https://www.vatican.va/roman_curia/secretariat_state/documents/RC_seg-st_20030308_pennacchio_en.html/_jcr_content/renditions/original.img.jpg',
    },
    {
      name: 'Archbishop Pedro López Quintana',
      years: '2003–2009',
      image: 'https://www.catholic-hierarchy.org/bishop/lquintana.html',
    },
    {
      name: 'Archbishop Adriano Bernardini',
      years: '1999–2003',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Adriano_Bernardini_2012.jpg',
    },
  ];

  return (
    <>
      <UpperHeader />
      <LowerHeader />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 mb-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Apostolic Vicar and Nuncio of Nepal
        </h1>

        {/* Two-column layout for current vicar and nuncio */}
        <div className="grid grid-cols-1 md:grid gap-8 mb-16">
          {/* Vicar */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="text-center flex-shrink-0">
              <img
                src={currentVicar.image}
                alt={currentVicar.name}
                className="w-48 h-48 rounded-lg mx-auto mb-4 object-cover shadow"
              />
              <h2 className="text-xl font-semibold text-blue-700">{currentVicar.name}</h2>
              <p className="text-gray-700">{currentVicar.title}</p>
              <p className="text-sm text-gray-500 mt-1">Appointed on {currentVicar.appointed}</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">About {currentVicar.name}</h3>
              <p className="text-gray-700 mb-4">{currentVicar.bio}</p>
              <h4 className="text-md font-semibold text-blue-600 mb-2">Contact Information</h4>
              <ul className="text-gray-700 space-y-1">
                <li>
                  Email:{' '}
                  <a href={`mailto:${currentVicar.email}`} className="text-blue-500 hover:underline">
                    {currentVicar.email}
                  </a>
                </li>
                <li>Phone: {currentVicar.phone}</li>
                <li>Office Hours: {currentVicar.officeHours}</li>
              </ul>
            </div>
          </div>

          {/* Nuncio */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="text-center flex-shrink-0">
              <img
                src={currentNuncio.image}
                alt={currentNuncio.name}
                className="w-48 h-48 rounded-lg mx-auto mb-4 object-cover shadow"
              />
              <h2 className="text-xl font-semibold text-blue-700">{currentNuncio.name}</h2>
              <p className="text-gray-700">{currentNuncio.title}</p>
              <p className="text-sm text-gray-500 mt-1">Appointed on {currentNuncio.appointed}</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">About {currentNuncio.name}</h3>
              <p className="text-gray-700 mb-4">{currentNuncio.bio}</p>
              <h4 className="text-md font-semibold text-blue-600 mb-2">Contact Information</h4>
              <ul className="text-gray-700 space-y-1">
                <li>
                  Email:{' '}
                  <a href={`mailto:${currentNuncio.email}`} className="text-blue-500 hover:underline">
                    {currentNuncio.email}
                  </a>
                </li>
                <li>Phone: {currentNuncio.phone}</li>
                <li>Office Hours: {currentNuncio.officeHours}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Former Vicars */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Former Apostolic Vicars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {formerVicars.map((vicar, index) => (
              <div key={index} className="text-center bg-gray-50 p-4 rounded-lg shadow">
                <img
                  src={vicar.image}
                  alt={vicar.name}
                  className="w-32 h-32 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{vicar.name}</h3>
                <p className="text-gray-600">{vicar.years}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Former Nuncios */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Former Apostolic Nuncios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {formerNuncios.map((nuncio, index) => (
              <div key={index} className="text-center bg-gray-50 p-4 rounded-lg shadow">
                <img
                  src={nuncio.image}
                  alt={nuncio.name}
                  className="w-32 h-32 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{nuncio.name}</h3>
                <p className="text-gray-600">{nuncio.years}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ApostolicVicar;