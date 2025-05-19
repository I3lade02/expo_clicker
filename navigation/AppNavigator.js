import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ThemeShopScreen from '../screens/ThemeShopScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Main' component={MainScreen} options={{ headerShown: false}} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName='Game'
            screenOptions={{
                drawerPosition: 'right',
                drawerType: 'slide',
                headerShown: true,
            }}
        >
            <Drawer.Screen name='Game' component={MainStack} />
            <Drawer.Screen name='Achievements' component={AchievementsScreen} />
            <Drawer.Screen name='Theme shop' component={ThemeShopScreen} />
        </Drawer.Navigator>
    );
}