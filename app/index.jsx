import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, COLORS } from '../src/lib';

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState({ clients: [], stats: [], leads: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [{ data: clients }, { data: stats }, { data: leads }] = await Promise.all([
      supabase.from('clients').select('*'),
      supabase.from('client_stats').select('*'),
      supabase.from('leads').select('*').eq('status', 'new'),
    ]);
    setData({ clients: clients || [], stats: stats || [], leads: leads || [] });
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const totalRevenue = data.clients.reduce((s, c) => s + (c.monthly_revenue || 0), 0);
  const totalTexts = data.stats.reduce((s, st) => s + (st.texts_sent || 0), 0);
  const totalReviews = data.stats.reduce((s, st) => s + (st.new_reviews || 0), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.gold} size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Revenue Banner */}
        <View style={styles.revBanner}>
          <Text style={styles.revLabel}>MONTHLY RECURRING REVENUE</Text>
          <Text style={styles.revAmount}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.revSub}>
            {data.clients.length} active client{data.clients.length !== 1 ? 's' : ''} · Axis Creative LLC
          </Text>
        </View>

        {/* Stat Grid */}
        <View style={styles.statGrid}>
          <StatCard value={data.clients.length} label="Active Clients" delta="All tiers" />
          <StatCard value={data.leads.length} label="New Leads" delta="Needs contact" deltaUp />
          <StatCard value={totalTexts} label="Texts Sent" delta="All clients" />
          <StatCard value={totalReviews} label="New Reviews" delta="This month" deltaUp />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.actionGrid}>
          <ActionBtn label="Clients" onPress={() => router.push('/clients')} icon="👥" />
          <ActionBtn label="Leads" onPress={() => router.push('/leads')} icon="📨" />
          <ActionBtn label="Live Site" onPress={() => Linking.openURL('https://presencyco.com')} icon="🌐" />
          <ActionBtn label="Make.com" onPress={() => Linking.openURL('https://make.com')} icon="⚙" />
        </View>

        {/* Recent clients */}
        {data.clients.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>RECENT CLIENTS</Text>
            {data.clients.slice(0, 3).map(c => (
              <TouchableOpacity key={c.id} style={styles.miniClient} onPress={() => router.push(`/client/${c.id}`)}>
                <View style={styles.miniAvatar}>
                  <Text style={styles.miniAvatarText}>{(c.business_name || '?')[0]}</Text>
                </View>
                <View style={styles.miniInfo}>
                  <Text style={styles.miniName}>{c.business_name}</Text>
                  <Text style={styles.miniSub}>{c.owner_name}</Text>
                </View>
                <Text style={styles.miniRev}>${(c.monthly_revenue || 0).toLocaleString()}/mo</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label, delta, deltaUp }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statAccent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statDelta, deltaUp && { color: COLORS.green }]}>{delta}</Text>
    </View>
  );
}

function ActionBtn({ label, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  loadingContainer: { flex: 1, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textDim, fontSize: 11, letterSpacing: 2 },

  revBanner: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    padding: 24,
    marginBottom: 12,
  },
  revLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: COLORS.textDim, marginBottom: 8 },
  revAmount: { fontSize: 52, fontWeight: '700', color: COLORS.gold, letterSpacing: -1, lineHeight: 56 },
  revSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, letterSpacing: 0.5 },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1, minWidth: '47%',
    backgroundColor: COLORS.surface2,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 16, position: 'relative', overflow: 'hidden',
  },
  statAccent: { position: 'absolute', top: 0, left: 0, width: 2, bottom: 0, backgroundColor: COLORS.gold },
  statValue: { fontSize: 32, fontWeight: '700', color: COLORS.gold, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.5 },
  statDelta: { fontSize: 10, color: COLORS.textDim, marginTop: 3, fontWeight: '600' },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: COLORS.textDim, marginBottom: 10 },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  actionBtn: {
    flex: 1, minWidth: '47%',
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 18, alignItems: 'center', gap: 8,
  },
  actionIcon: { fontSize: 26 },
  actionLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textMuted },

  miniClient: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 8,
  },
  miniAvatar: {
    width: 40, height: 40,
    backgroundColor: COLORS.surface3,
    borderWidth: 1, borderColor: COLORS.borderGold,
    alignItems: 'center', justifyContent: 'center',
  },
  miniAvatarText: { fontSize: 18, fontWeight: '600', color: COLORS.gold },
  miniInfo: { flex: 1 },
  miniName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  miniSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  miniRev: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
});
