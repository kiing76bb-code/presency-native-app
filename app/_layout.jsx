import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { COLORS } from '../src/lib';

const HomeIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12L12 3l9 9" />
    <Path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
  </Svg>
);

const ClientsIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={9} cy={7} r={3} />
    <Path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <Circle cx={17} cy={9} r={2} />
    <Path d="M21 20c0-2.2-1.8-4-4-4" />
  </Svg>
);

const LeadsIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <Line x1={9} y1={9} x2={15} y2={9} />
    <Line x1={9} y1={13} x2={13} y2={13} />
  </Svg>
);

const SettingsIcon = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={3} />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </Svg>
);

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.black} />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
          headerTintColor: COLORS.gold,
          headerTitleStyle: { fontWeight: '600', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, borderTopWidth: 1, height: 72, paddingBottom: 12, paddingTop: 8 },
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: COLORS.textDim,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 },
          headerLeft: () => (
            <View style={{ paddingLeft: 20 }}>
              <Svg width={8} height={8} viewBox="0 0 8 8">
                <Circle cx={4} cy={4} r={4} fill={COLORS.gold} />
              </Svg>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: 'Clients',
            tabBarLabel: 'Clients',
            tabBarIcon: ({ color }) => <ClientsIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarLabel: 'Leads',
            tabBarIcon: ({ color }) => <LeadsIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="client/[id]"
          options={{ href: null, title: 'Client' }}
        />
      </Tabs>
    </>
  );
}
