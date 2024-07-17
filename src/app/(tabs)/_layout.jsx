import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'
import "../../global.css"


const TabIcon = ({ icon, color, name, focused}) => {
    return (
        <View className="items-center justify-center gap-2 ">
            <Image 
                source={icon}
                tintColor={color}
                className="w-6 h-6"
                resizeMode='contain'
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{color: color}}>
                {name}
            </Text>
        </View>
    )
}
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#736ced',
            tabBarInactiveTintColor: '#999897',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
              //  borderTopColor: '#000000',
                height: 84,
            }
        }}
      >
        <Tabs.Screen
            name="home"
            options={{
                title: '',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.home}
                    color={color}
                    name="Accueil"
                    focused={focused}
                />
                )
            }}
            />

        <Tabs.Screen
            name="bookmark"
            options={{
                title: 'Biens',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.bookmark}
                    color={color}
                    name="Biens"
                    focused={focused}
                />
                )
            }}
            />

        <Tabs.Screen
            name="premium"
            options={{
                title: 'Premium',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.plus}
                    color={color}
                    name="Premium"
                    focused={focused}
                />
                )
            }}
            />

        <Tabs.Screen
            name="settings"
            options={{
                title: 'Paramètres',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.profile}
                    color={color}
                    name="Profile"
                    focused={focused}
                    
                />
                )
            }}
            />

      </Tabs>
    </>
  )
}

export default TabsLayout