import React from 'react'
import UpperHeader from '../../components/UpperHeader'
import LowerHeader from '../../components/LowerHeader'
import HeroSlider from '../../components/HeroSlider'
import Footer from '../../components/Footer'
import Events from '../../components/events'
import NewsUpdates from '../../components/NewsUpdates'
import VideoEmbedder from '../../components/VideoUpdates'


const Home = () => {
  return (
    <div>
      <div className="flex flex-col">
  {/* LowerHeader shows first on small, second on desktop */}
  <div className="order-1 md:order-2">
    <LowerHeader />
  </div>

  {/* UpperHeader shows second on small, first on desktop */}
  <div className="order-2 md:order-1">
    <UpperHeader />
  </div>
</div>
    <HeroSlider></HeroSlider>
      <Events></Events>
      <NewsUpdates></NewsUpdates>
      <VideoEmbedder></VideoEmbedder>
      <Footer></Footer>
    </div>
  )
}

export default Home
