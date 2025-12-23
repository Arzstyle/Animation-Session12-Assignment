import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SWIPE_LIMIT = width * 0.25;

interface CardProps {
    index: number;
    activeIndex: number;
    activeTranslation: SharedValue<number>;
    totalCards: number;
    onSwipeComplete: () => void;
    data: { text: string; color: string; image: any };
}

const SwipeableCard = ({
    index,
    activeIndex,
    activeTranslation,
    totalCards,
    onSwipeComplete,
    data,
}: CardProps) => {
    const relativeIndex = (index - activeIndex + totalCards) % totalCards;

    const showIndicators = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .enabled(relativeIndex === 0)
        .onStart(() => {
            showIndicators.value = 1;
        })
        .onUpdate((event) => {
            activeTranslation.value = event.translationX;
        })
        .onEnd(() => {
            if (Math.abs(activeTranslation.value) > SWIPE_LIMIT) {
                const direction = activeTranslation.value > 0 ? 1 : -1;
                activeTranslation.value = withSpring(direction * width * 1.5, {}, (finished) => {
                    if (finished) {
                        showIndicators.value = 0;
                        runOnJS(onSwipeComplete)();
                    }
                });
            } else {
                activeTranslation.value = withSpring(0);
                showIndicators.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        if (relativeIndex === 0) {
            const rotate = interpolate(
                activeTranslation.value,
                [-width, 0, width],
                [-15, 0, 15]
            );
            return {
                zIndex: 3,
                transform: [
                    { translateX: activeTranslation.value },
                    { rotate: `${rotate}deg` },
                    { scale: 1 },
                ],
            };
        }

        if (relativeIndex === 1) {
            const scale = interpolate(
                Math.abs(activeTranslation.value),
                [0, width],
                [0.9, 1],
                'clamp'
            );

            return {
                zIndex: 2,
                transform: [
                    { scale },
                ],
            };
        }

        if (relativeIndex === 2) {
            const scale = interpolate(
                Math.abs(activeTranslation.value),
                [0, width],
                [0.8, 0.9],
                'clamp'
            );
            return {
                zIndex: 1,
                transform: [{ scale }],
                opacity: 1,
            };
        }

        return { zIndex: -1, opacity: 0 };
    });

    const rightSwipeStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            activeTranslation.value,
            [0, width / 4],
            [0, 1],
            'clamp'
        );
        return { opacity: opacity * showIndicators.value };
    });

    const leftSwipeStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            activeTranslation.value,
            [-width / 4, 0],
            [1, 0],
            'clamp'
        );
        return { opacity: opacity * showIndicators.value };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                style={[
                    styles.card,
                    animatedStyle,
                    { backgroundColor: 'white' },
                ]}
            >
                <Animated.Image
                    source={data.image}
                    style={[styles.image, StyleSheet.absoluteFillObject]}
                    resizeMode="cover"
                />

                {relativeIndex === 0 && (
                    <>
                        <Animated.View style={[styles.indicatorContainer, { left: 40 }, rightSwipeStyle]}>
                            <Text style={styles.indicatorText}>❌</Text>
                        </Animated.View>

                        <Animated.View style={[styles.indicatorContainer, { right: 40 }, leftSwipeStyle]}>
                            <Text style={styles.indicatorText}>❤️</Text>
                        </Animated.View>

                    </>
                )}

                <Text style={styles.text}>{data.text}</Text>
            </Animated.View>
        </GestureDetector >
    );
};

export default SwipeableCard;

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: width - 40,
        height: 400,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    text: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 20,
        left: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    indicatorContainer: {
        position: 'absolute',
        top: 40,
        zIndex: 10,
    },
    indicatorText: {
        fontSize: 32,
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 5,
    },
});
