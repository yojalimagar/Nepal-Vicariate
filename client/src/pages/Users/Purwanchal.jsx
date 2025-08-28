import React from 'react'
import UpperHeader from '../../components/UpperHeader'
import LowerHeader from '../../components/LowerHeader'
import Footer from '../../components/Footer'
import ParishSidebar from '../../components/ParishSidebar'
Footer
const Purwanchal = () => {
  return (
    <>
    <UpperHeader/>
    <LowerHeader/>
    
    <div>
        <ParishSidebar/>
     Main Content here 
    </div>
    <Footer/>
    </>
  )
}

export default Purwanchal
