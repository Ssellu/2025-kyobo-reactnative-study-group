import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Ex03Counter() {
    console.log('useCallback - App component re-rendered');
    const [count, setCount] = useState(0);

    const increment = useCallback(() => {
        setCount(prevCount => prevCount + 1);
    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Count: {count}</Text>
        <Button title="Increment" onPress={increment} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 40,
    },
    text: {
        fontSize: 24,
        marginBottom: 16,
    },
});
