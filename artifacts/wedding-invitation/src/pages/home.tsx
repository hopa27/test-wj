import React, { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { SectionDivider } from '../components/wedding/SectionDivider';
import { ScrollIntro } from '../components/wedding/ScrollIntro';
import { AudioPlayer } from '../components/wedding/AudioPlayer';
import { Hero } from '../components/wedding/Hero';
import { ScrollFilm } from '../components/wedding/ScrollFilm';
import { Invitation } from '../components/wedding/Invitation';
import { ScratchDate } from '../components/wedding/ScratchDate';
import { Timeline } from '../components/wedding/Timeline';
import { Venue } from '../components/wedding/Venue';
import { RsvpCard } from '../components/wedding/RsvpCard';
import { Closing } from '../components/wedding/Closing';
import { PhotoInterlude } from '../components/wedding/PhotoInterlude';

export function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [dateRevealed, setDateRevealed] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-clip">
      <ScrollIntro onOpen={() => setIsStarted(true)} onDone={() => setAudioOn(true)} />
      
      {/* We mount the player and pass the play state. 
          When isStarted is true, audio starts. */}
      <AudioPlayer play={audioOn} />

      {isStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <main>
            <Hero />
            <ScrollFilm />
            <Invitation />
            <SectionDivider variant="paisley" />
            <ScratchDate onRevealed={() => setDateRevealed(true)} />
            {dateRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <SectionDivider />
                <PhotoInterlude
                  src="images/couple-courtyard.png"
                  alt="Juhi and Shubhojit celebrating in a heritage courtyard"
                />
                <Timeline />
                <RsvpCard />
                <PhotoInterlude
                  src="images/couple-lotus.png"
                  alt="Juhi and Shubhojit resting together among lotus flowers"
                  framed
                />
                <Venue />
                <Closing />
              </motion.div>
            )}
          </main>
        </motion.div>
      )}
    </div>
    </MotionConfig>
  );
}
