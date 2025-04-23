import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function CameraScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Camera Screen</Text>
        </View>
    );
}

function LocationScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Location Screen</Text>
        </View>
    );
}

function MainScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Go to Camera" onPress={() => navigation.navigate('Camera')} />
            <Button title="Go to Location" onPress={() => navigation.navigate('Location')} />
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="Location" component={LocationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}