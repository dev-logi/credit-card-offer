import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../config/theme';

interface ModernButtonProps {
    title: string;
    onPress: () => void;
    mode?: 'contained' | 'outlined' | 'text';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: string;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
    title,
    onPress,
    mode = 'contained',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    if (mode === 'contained') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.container, style]}
            >
                <LinearGradient
                    colors={disabled ? ['#475569', '#475569'] : theme.colors.gradients.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={[styles.text, textStyle]}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // Outlined/Text variants can be simple views for now
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.outlinedContainer,
                mode === 'outlined' && styles.outlinedBorder,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.roundness,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    outlinedContainer: {
        paddingVertical: 15,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.roundness,
    },
    outlinedBorder: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
