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
            tabBarActiveTintColor: '#8783d1',
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
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.home}
                    color={color}
                    name="Home"
                    focused={focused}
                />
                )
            }}
            />

        <Tabs.Screen
            name="bookmark"
            options={{
                title: 'Bookmark',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.bookmark}
                    color={color}
                    name="Bookmark"
                    focused={focused}
                />
                )
            }}
            />

        <Tabs.Screen
            name="create"
            options={{
                title: 'Create',
                headerShown: false,
                tabBarIcon: ({ color, focused}) => (
                <TabIcon
                    icon={icons.plus}
                    color={color}
                    name="Create"
                    focused={focused}
                />
                )
            }}
            />

        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
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