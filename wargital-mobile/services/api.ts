import axios from 'axios';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
const API_URL = Platform.select({
    ios: 'http://localhost:3000/api', // Simulator
    android: 'http://192.168.100.10:3000/api', // LAN IP (Use this instead of 10.0.2.2)
    default: 'http://localhost:3000/api',
});


