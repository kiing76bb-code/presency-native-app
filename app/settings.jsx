import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, STRIPE_LINKS } from '../src/lib';

const PLATFORMS = [
  { label: 'presencyco.com', url: 'https://presencyco.com' },
  { label: 'Make.com Scenarios', url: 'https://make.com' },
  { label: 'Stripe Dashboard', url: 'https://dashboard.stripe.com' },
  { label: 'Supabase Database', url: 'https://supabase.com/dashboard' },
  { label: 'GitHub Repo', url: 'https://github.com/kiing76bb-code/presencyco' },
  { label: 'Figma Assets', url: 'https://www.figma.com/design/uYmIbNTT9coTKrbgkgvaIn' },
  { label: 'Cloudflare DNS', url: 'https://dash.cloudflare.com' },
];

const PAYMENT_LINKS = [
  { label: 'Starter — $397/mo', key: 'starter' },
  { label: 'Presence — $697/mo', key: 'presence' },
  { label: 'Full Front Office — $1,197/mo', key: 'full_front_office' },
];

export default function SettingsScreen() {
  const copyLink = async (key) => {
    await Clipboard.setStringAsync(STRIPE_LINKS[key]);
    Alert.alert('Copied!', `${key.replace(/_/g,' ')} payment link copied to clipboard`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Pricing */}
        <Text style={styles.sectionLabel}>PRICING TIERS</Text>
        <View style={styles.card}>
          {[['Starter', '$397/mo'], ['Presence', '$697/mo'], ['Full Front Office', '$1,197/mo']].map(([name, price]) => (
            <View key={name} style={styles.row}>
              <Text style={styles.rowLabel}>{name}</Text>
              <Text style={styles.rowValue}>{price}</Text>
            </View>
          ))}
        </View>

        {/* Stripe Links */}
        <Text style={styles.sectionLabel}>STRIPE PAYMENT LINKS</Text>
        <View style={styles.card}>
          {PAYMENT_LINKS.map(({ label, key }) => (
            <View key={key} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <TouchableOpacity onPress={() => copyLink(key)}>
                <Text style={styles.copyBtn}>Copy ↗</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Platform Links */}
        <Text style={styles.sectionLabel}>PLATFORM LINKS</Text>
        <View style={styles.card}>
          {PLATFORMS.map(({ label, url }) => (
            <TouchableOpacity key={label} style={styles.row} onPress={() => Linking.openURL(url)}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.openBtn}>Open →</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Business Info */}
        <Text style={styles.sectionLabel}>BUSINESS</Text>
        <View style={styles.card}>
          {[
            ['Brand', 'Presency'],
            ['LLC', 'Axis Creative LLC'],
            ['Location', 'Las Vegas, NV'],
            ['Email', 'hello@presencyco.com'],
            ['Website', 'presencyco.com'],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>PRESENCY · AXIS CREATIVE LLC · LAS VEGAS, NV</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: COLORS.textDim, marginBottom: 8 },
  card: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowLabel: { fontSize: 13, color: COLORS.text, fontWeight: '500', flex: 1 },
  rowValue: { fontSize: 13, color: COLORS.textMuted },
  copyBtn: { fontSize: 12, color: COLORS.gold, fontWeight: '700', letterSpacing: 0.3 },
  openBtn: { fontSize: 12, color: COLORS.gold, fontWeight: '700', letterSpacing: 0.3 },
  footer: { textAlign: 'center', fontSize: 9, color: COLORS.textDim, letterSpacing: 2, marginTop: 8 },
});
