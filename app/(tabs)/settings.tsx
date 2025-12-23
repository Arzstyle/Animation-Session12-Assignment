import SwipeableCard from '@/components/SwipeableCard';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

const idol1 = require('../../assets/imagescard/idol1.jpg');
const idol2 = require('../../assets/imagescard/idol2.jpg');
const idol3 = require('../../assets/imagescard/idol3.jpg');

const DATA = [
  { id: 1, text: 'Jang Woonyoung', color: '#6366F1', image: idol1 },
  { id: 2, text: 'Ning Ning', color: '#10B981', image: idol2 },
  { id: 3, text: 'Liz', color: '#F43F5E', image: idol3 },
];

const Settings = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTranslation = useSharedValue(0);

  React.useEffect(() => {
    activeTranslation.value = 0;
  }, [currentIndex]);

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % DATA.length);
  };

  return (
    <View style={styles.container}>
      {DATA.map((item, index) => {
        return (
          <SwipeableCard
            key={item.id}
            data={item}
            index={index}
            activeIndex={currentIndex}
            activeTranslation={activeTranslation}
            totalCards={DATA.length}
            onSwipeComplete={handleNextCard}
          />
        );
      })}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  }
});