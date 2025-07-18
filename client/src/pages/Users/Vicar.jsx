import React from 'react'
import UpperHeader from '../../components/UpperHeader';
import LowerHeader from '../../components/LowerHeader';
import Footer from '../../components/Footer';
const Vicar = () => {
 return (
    <>
    <UpperHeader/>
    <LowerHeader/>
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      <main className="flex-grow container mx-auto p-6 md:p-8 lg:p-10">
        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">The Journey of Faith in Nepal</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The history of the Catholic Church in Nepal is a testament to perseverance and faith, evolving from early missionary efforts to the establishment of the Apostolic Vicariate. This journey reflects the dedication of many individuals who laid the groundwork for the vibrant Catholic community present today.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Early Missionary Presence (1700s - 1900s)</h3>
              <p className="text-gray-600 leading-relaxed">
                While formal structures were not yet in place, historical records indicate the presence of Catholic missionaries, particularly Capuchin Fathers, in Nepal as early as the 18th century. Their work was primarily focused on humanitarian aid and pastoral care for small communities, often facing significant challenges in a largely closed kingdom.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">The Modern Era and Re-establishment (Mid-20th Century)</h3>
              <p className="text-gray-600 leading-relaxed">
                After a period of limited activity, the Catholic presence began to re-emerge in the mid-20th century. The arrival of Jesuit missionaries in the 1950s marked a significant turning point, particularly in the fields of education and social service, which gradually opened doors for more formal pastoral work.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Establishment of the Mission (1983)</h3>
              <p className="text-gray-600 leading-relaxed">
                A pivotal moment came on November 7, 1983, when Pope John Paul II officially established the Mission "Sui Iuris" of Nepal, separating it from the Diocese of Patna, India. This marked the beginning of an autonomous ecclesiastical territory in Nepal, a crucial step towards its self-governance.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Elevation to Apostolic Prefecture (1996)</h3>
              <p className="text-gray-600 leading-relaxed">
                Recognizing the growth and development of the Catholic community, the Mission "Sui Iuris" was elevated to an Apostolic Prefecture on November 8, 1996. This elevation signified a greater level of maturity and organization within the local Church, paving the way for further expansion of its pastoral and social activities.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">The Apostolic Vicariate of Nepal (2007)</h3>
              <p className="text-gray-600 leading-relaxed">
                On May 23, 2007, Pope Benedict XVI elevated the Apostolic Prefecture of Nepal to an Apostolic Vicariate. This significant step further solidified the Church's presence and structure in Nepal, granting it a higher ecclesiastical status and reflecting the increasing number of Catholics and the expanding pastoral needs.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Current Leadership and Future</h3>
              <p className="text-gray-600 leading-relaxed">
                The Apostolic Vicariate continues to grow under the guidance of its current Apostolic Vicar, serving the spiritual and social needs of the Catholic faithful across Nepal. The Church remains committed to its mission of evangelization, education, healthcare, and social justice, contributing positively to Nepali society.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xl font-medium text-gray-800">
              This rich history is a foundation for the vibrant faith community that continues to flourish in Nepal.
            </p>
          </div>
        </section>
      </main>
    </div>
    <Footer/>
    </>
    
  );
}

export default Vicar
