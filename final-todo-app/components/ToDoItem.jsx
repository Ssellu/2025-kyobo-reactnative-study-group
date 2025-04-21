import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TodoItem({ item }) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.text,
                        item.completed && styles.completedText
                    ]}
                >
                    {item.text}
                </Text>
                {item.date && (
                    <Text style={styles.date}>
                        {item.date instanceof Date
                            ? item.date.toLocaleDateString()
                            : new Date(item.date).toLocaleDateString()}ㄴㄴ
                    </Text>
                )}
            </View>
            <Text style={styles.priority}>{item.priority}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    priority: {
        color: '#FF6347',
        fontWeight: 'bold',
        fontSize: 14,
    },
    date: {
        color: '#888',
        fontSize: 12,
        marginTop: 5,
    },
});
