import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../config/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
    if (Platform.OS === 'android') {
        // Android doesn't support BlurView well in all cases, use a semi-transparent background
        return (
            <View style={[styles.androidContainer, style]}>
                {children}
            </View>
        );
    }

    return (
        <BlurView intensity={intensity} tint="dark" style={[styles.container, style]}>
            {children}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.roundness,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    androidContainer: {
        borderRadius: theme.roundness,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // Slate 800 with opacity
    },
});
