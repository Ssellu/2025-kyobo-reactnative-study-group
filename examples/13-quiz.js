import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraView, Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';


const RECORDS_DIRECTORY = FileSystem.documentDirectory + 'records/';
const RECORDS_FILE = FileSystem.documentDirectory + 'records.json';

const setupStorage = async () => {
    const dirInfo = await FileSystem.getInfoAsync(RECORDS_DIRECTORY);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(RECORDS_DIRECTORY, { intermediates: true });
    }
    
    const fileInfo = await FileSystem.getInfoAsync(RECORDS_FILE);
    if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(RECORDS_FILE, JSON.stringify([]));
    }
};

const saveRecord = async (photo, note, location) => {
    try {
        const timestamp = new Date().getTime();
        const fileName = `photo_${timestamp}.jpg`;
        const newPath = RECORDS_DIRECTORY + fileName;
        
        await FileSystem.copyAsync({
            from: photo,
            to: newPath
        });
        
        const record = {
            id: timestamp.toString(),
            photoUri: newPath,
            note: note,
            location: location,
            createdAt: timestamp
        };
        
        const recordsJson = await FileSystem.readAsStringAsync(RECORDS_FILE);
        const records = JSON.parse(recordsJson);
        
        records.push(record);
        await FileSystem.writeAsStringAsync(RECORDS_FILE, JSON.stringify(records));
        
        return true;
    } catch (error) {
        console.error('Error saving record:', error);
        return false;
    }
};

const getRecords = async () => {
    try {
        const recordsJson = await FileSystem.readAsStringAsync(RECORDS_FILE);
        const records = JSON.parse(recordsJson);
        return records.sort((a, b) => b.createdAt - a.createdAt); 
    } catch (error) {
        console.error('Error getting records:', error);
        return [];
    }
};

function CameraScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const cameraRef = useRef(null);
    const [type, setType] = useState('back');

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
            
            setHasPermission(cameraStatus === 'granted');
            
            if (locationStatus === 'granted') {
                try {
                    const location = await Location.getCurrentPositionAsync({});
                    setLocation(location.coords);
                } catch (error) {
                    setLocationError('Could not get location');
                }
            }
        })();
        
        const locationSubscription = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 10000 },
            (newLocation) => {
                setLocation(newLocation.coords);
            }
        );
        
        return () => {
            if (locationSubscription) {
                locationSubscription.then(sub => sub.remove());
            }
        };
    }, []);
    
    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                navigation.navigate('RecordDetails', { 
                    photoUri: photo.uri,
                    location: location
                });
            } catch (error) {
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            navigation.navigate('RecordDetails', { 
                photoUri: result.assets[0].uri,
                location: location
            });
        }
    };
    
    if (hasPermission === null) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }
    
    if (hasPermission === false) {
        return <View style={styles.centered}><Text>No access to camera</Text></View>;
    }
    
    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef} facing={type}>
                <View style={styles.locationInfo}>
                    {location ? (
                        <Text style={styles.locationText}>
                            📍 Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}
                        </Text>
                    ) : (
                        <Text style={styles.locationText}>Getting location...</Text>
                    )}
                </View>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Ionicons name="images" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

function RecordDetailsScreen({ route, navigation }) {
    const { photoUri, location } = route.params;
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    
    const saveAndReturn = async () => {
        if (note.trim() === '') {
            Alert.alert('Error', 'Please enter a note');
            return;
        }
        
        setSaving(true);
        const success = await saveRecord(photoUri, note, location);
        setSaving(false);
        
        if (success) {
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to save record');
        }
    };
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
                
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your notes here..."
                    multiline={true}
                    value={note}
                    onChangeText={setNote}
                />
                
                {location && (
                    <View style={styles.locationContainer}>
                        <Text style={styles.locationLabel}>Location:</Text>
                        <Text>Latitude: {location.latitude.toFixed(6)}</Text>
                        <Text>Longitude: {location.longitude.toFixed(6)}</Text>
                    </View>
                )}
                
                <TouchableOpacity 
                    style={styles.registerButton} 
                    onPress={saveAndReturn}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.registerButtonText}>Register</Text>
                    )}
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

function RecordsScreen({ navigation }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadRecords = async () => {
            await setupStorage();
            const data = await getRecords();
            setRecords(data);
            setLoading(false);
        };
        
        loadRecords();
        
        const unsubscribe = navigation.addListener('focus', loadRecords);
        return unsubscribe;
    }, [navigation]);
    
    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Records</Text>
            
            {records.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="images-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyStateText}>No records yet</Text>
                    <TouchableOpacity 
                        style={styles.newRecordButton}
                        onPress={() => navigation.navigate('Camera')}
                    >
                        <Text style={styles.newRecordButtonText}>Create New Record</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={records}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.recordItem}>
                            <Image source={{ uri: item.photoUri }} style={styles.recordImage} />
                            <View style={styles.recordInfo}>
                                <Text style={styles.recordNote} numberOfLines={2}>{item.note}</Text>
                                <Text style={styles.recordDate}>
                                    {new Date(item.createdAt).toLocaleString()}
                                </Text>
                                {item.location && (
                                    <Text style={styles.recordLocation}>
                                        📍 {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                />
            )}
            
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('Camera')}
            >
                <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

function LocationMapScreen() {
    return (
        <View style={styles.centered}>
            <Text>Map feature coming soon!</Text>
        </View>
    );
}
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    
                    if (route.name === 'Records') {
                        iconName = focused ? 'images' : 'images-outline';
                    } else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            })}
        >
            <Tab.Screen name="Records" component={RecordsScreen} />
            <Tab.Screen name="Map" component={LocationMapScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Main" 
                    component={MainTabs} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Camera" 
                    component={CameraScreen} 
                    options={{ title: 'Take Photo' }}
                />
                <Stack.Screen 
                    name="RecordDetails" 
                    component={RecordDetailsScreen} 
                    options={{ title: 'New Record' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: 'transparent'
    },
    button: {
        position: 'absolute',
        left: 30,
        padding: 15,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    previewImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    textInput: {
        margin: 15,
        padding: 15,
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top',
    },
    locationContainer: {
        margin: 15,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    locationLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    registerButton: {
        margin: 15,
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 15,
        textAlign: 'center',
    },
    recordItem: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    recordImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    recordInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    recordNote: {
        fontSize: 16,
        fontWeight: '500',
    },
    recordDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    recordLocation: {
        fontSize: 12,
        color: '#666',
        marginTop: 3,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 18,
        color: '#666',
        marginVertical: 10,
    },
    newRecordButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    newRecordButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    locationInfo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
    },
    locationText: {
        color: 'white',
        textAlign: 'center',
    },
});