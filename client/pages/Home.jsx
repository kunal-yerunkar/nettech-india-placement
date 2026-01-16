import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Domains from '../components/Domains';
import Features from '../components/Features';
import Process from '../components/Process';
import Partners from '../components/Partners';
import PlacedStudents from '../components/PlacedStudents';
import StatsCounter from '../components/StatsCounter';

const Home = () => {
  return (
    <>
      <Hero />
      <StatsCounter />
      <About />
      <Domains />
      <Features />
      <Process />
      <Partners />
      <PlacedStudents />
    </>
  );
};

export default Home;