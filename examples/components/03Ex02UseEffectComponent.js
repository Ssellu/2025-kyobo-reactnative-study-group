import React, { useState, useEffect} from "react";
import { View, Text, Button } from "react-native";

export default function Ex02Timer() {
    console.log('useEffect - App component re-rendered');
    const [count, setCount] = useState(0);

    useEffect(() => {   
        const timer = setInterval(() => setCount(c => c + 1), 1000);
        return () => clearInterval(timer);  // UseEffect는 cleanup 함수를 리턴할 수 있다.
    }, []); // 빈 배열을 넣으면 componentDidMount와 같은 역할을 한다. 빈 배열이 아니면, componentDidUpdate와 같은 역할을 한다.

    return (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 24 }}>Timer: {count}</Text>
            <Button title="Reset" onPress={() => setCount(0)} />
        </View>
    );
}